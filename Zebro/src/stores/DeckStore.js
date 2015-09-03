import Reflux from 'reflux';
import _ from 'lodash';

import {DeckActions} from './../actions';
import CardsStore from './CardsStore';
import DeckMetaStore from './DeckMetaStore';

/**
 * Emits current deck with *due* cards.
 **/

export default Reflux.createStore({
  init() {
    // Info about the state of the app, to track
    this._deckInfos = null;
    this._cards = [];

    // Info about the current deck
    this._currentDeckInfo = null;
    this._currentDeckID = null;
    this._currentDeckCards = [];

    this.listenTo(CardsStore, this.cardUpdate);
    this.listenTo(DeckMetaStore, this.deckMetaUpdate);
    this.listenToMany(DeckActions);
  },

  deckMetaUpdate(deckInfos) {
    this._deckInfos = deckInfos;
    this._setCurrentDeckInfo();
  },

  _setCurrentDeckInfo() {
    if (this._currentDeckID == null) {
      return;
    }

    // Find the right deckInfo
    var deck = this._deckInfos.filter((d) => {
      return d.id === this._currentDeckID;
    });
    if (deck.length !== 1) {
      return;
    }

    this._currentDeckInfo = deck[0];
  },

  emit() {
    this.trigger({
      deckInfo: this._currentDeckInfo,
      cards: this._currentDeckCards
    });
  },

  cardUpdate(cards) {
    this._cards = cards;
  },

  onCreateDeck() {
    console.log('onCreateDeck');
  },

  onDeleteDeck() {
    console.log('onDeleteDeck');
  },

  onReviewDeck(deckID) {
    var now = new Date();
    this._currentDeckCards = this._cards.filter((c) => {
      return c.deckID === deckID && now >= c.dueDate;
    });

    this._currentDeckCards = _.shuffle(this._currentDeckCards);
    this.emit();
  }

});
