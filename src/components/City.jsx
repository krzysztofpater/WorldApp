import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import { FlagEmojiToPNG } from "./FlagToEmoji";
import BackButton from "./BackButton";
import styles from "./City.module.css";

const formatDate = (date) =>
	new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "long",
		year: "numeric",
		weekday: "long",
	}).format(new Date(date));

function City() {
	const { id } = useParams();
	const { isLoading, currentCity, getCity } = useCities();

	// const [searchParams, setSearchParams] = useSearchParams();
	// const lat = searchParams.get("lat");
	// const lng = searchParams.get("lng");

	useEffect(() => {
		getCity(id);
	}, [id]);

	const { cityName, emoji, date, notes } = currentCity;

	return (
		<div className={styles.city}>
			{isLoading && <Spinner />}
			{!isLoading && cityName && (
				<>
					<div className={styles.row}>
						<h6>City name</h6>
						<h3>
							<span>
								<FlagEmojiToPNG flag={emoji} />
							</span>
							{cityName}
						</h3>
					</div>

					<div className={styles.row}>
						<h6>You went to {cityName} on</h6>
						<p>{formatDate(date || null)}</p>
					</div>

					{notes && (
						<div className={styles.row}>
							<h6>Your notes</h6>
							<p>{notes}</p>
						</div>
					)}

					<div className={styles.row}>
						<h6>Learn more</h6>
						<a
							href={`https://en.wikipedia.org/wiki/${cityName}`}
							target='_blank'
							rel='noreferrer'>
							Check out {cityName} on Wikipedia &rarr;
						</a>
					</div>

					<div>
						<BackButton />
					</div>
				</>
			)}
		</div>
	);
}

export default City;
