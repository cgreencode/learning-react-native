import { AsyncStorage } from 'react-native';
import Deck from './../data/Deck';
export const DECK_KEY = 'flashcards:decks';

async read(key, deserializer) {
    try {
    let val = await AsyncStorage.getItem(key);
    if (val !== null) {
      let readValue = JSON.parse(val).map((serialized) => {
        return deserializer(serialized);
      });
      console.log('Read value: ');
      console.log(readValue);
      return readValue;
    }
    else {
      console.info(`${key} not found on disk.`);
    }
  } catch (error) {
    console.error('AsyncStorage error: ', error.message);
  }
}

async write(key, item) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  }
  catch (error) {
    console.error('AsyncStorage error: ', error.message);
  }  
}

export readDecks = () => {
  return read(DECK_KEY, Deck.fromObject);
}

export writeDecks = (decks) => {
  return write(DECK_KEY, decks);
}
