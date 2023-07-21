/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:9000";

function CitiesProvider({ children }) {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

	useEffect(function () {
		async function fetchCities() {
			try {
				setIsLoading(true);
				const data = await (await fetch(`${BASE_URL}/cities`)).json();
				setCities(data);
			} catch {
				alert("Error occured");
			} finally {
				setIsLoading(false);
			}
		}
		fetchCities();
	}, []);

	async function getCity(id) {
		try {
			setIsLoading(true);
			const data = await (await fetch(`${BASE_URL}/cities/${id}`)).json();
			setCurrentCity(data);
		} catch {
			alert("Error occured");
		} finally {
			setIsLoading(false);
		}
	}

	async function createCity(newCity) {
		try {
			setIsLoading(true);
			const data = await (
				await fetch(`${BASE_URL}/cities/`, {
					method: "POST",
					body: JSON.stringify(newCity),
					headers: { "Content-Type": "application/json" },
				})
			).json();
			setCities((cities) => [...cities, data]);
		} catch {
			alert("There was an error with city addition");
		} finally {
			setIsLoading(false);
		}
	}

	async function deleteCity(id) {
		try {
			setIsLoading(true);
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});
			setCities((cities) => cities.filter((city) => city.id !== id));
		} catch {
			alert("There was an error deleting the city");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				createCity,
				deleteCity,
			}}>
			{children}
		</CitiesContext.Provider>
	);
}

function useCities() {
	const context = useContext(CitiesContext);
	if (context === undefined)
		throw new Error("Cities context was used outside the CityProvider");

	return context;
}

export { CitiesProvider, useCities };
