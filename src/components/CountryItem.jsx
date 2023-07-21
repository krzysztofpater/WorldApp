import { FlagEmojiToPNG } from "./FlagToEmoji";
import styles from "./CountryItem.module.css";

function CountryItem({ country }) {
	return (
		<li className={styles.countryItem}>
			<span>
				<FlagEmojiToPNG flag={country.emoji} />
			</span>
			<span>{country.country}</span>
		</li>
	);
}

export default CountryItem;
