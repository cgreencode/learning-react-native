import React from 'react-native';
var {
  StyleSheet,
  View
} = React;

import Button from './../Button';
import NormalText from './../NormalText';
import HeadingText from './../HeadingText';

import { CardActions } from './../../actions';

var ContinueButton = React.createClass({
  propTypes: {
    onPress: React.PropTypes.func.isRequired,
    wasCorrect: React.PropTypes.bool.isRequired
  },
  render() {
    text = this.props.wasCorrect
      ? 'Correct!'
      : 'Oops, not quite.'
      ;
    return (
      <Button onPress={this.props.onPress} style={styles.continueButton}>
        <NormalText>{text}</NormalText>
      </Button>
      );
  }
});

var ViewCard = React.createClass({
  displayName: 'ViewCard',

  propTypes: {
    continue: React.PropTypes.func.isRequired,
    onReview: React.PropTypes.func.isRequired,
    orientation: React.PropTypes.string.isRequired,
    cardID: React.PropTypes.string.isRequired,
    answers: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    correctAnswer: React.PropTypes.string.isRequired,
    prompt: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      showingAnswer: false,
      wasCorrect: null
    };
  },

  _continue() {
    this.setState(this.getInitialState());
    this.props.continue();
  },

  _selectAnswer(correct) {
    this.props.onReview(correct);
    this.setState({
      showingAnswer: true,
      wasCorrect: correct
    });
    CardActions.review(this.props.cardID, this.props.orientation, correct)
  },

  _buttons() {
    if (!this.props.answers) {
      return null;
    }

    return this.props.answers.map((a) => {
      let isCorrectAnswer = a === this.props.correctAnswer;
      let buttonStyle = [styles.options];
      if (this.state.showingAnswer && isCorrectAnswer) {
        if (this.state.wasCorrect) {
          buttonStyle.push(styles.rightAnswer);
        }
        else {
          buttonStyle.push(styles.wrongAnswer);
        }
      }
      return (
        <Button
          key={a}
          disabled={this.state.showingAnswer}
          style={buttonStyle}
          onPress={this._selectAnswer.bind(this, a === this.props.correctAnswer)}>
          <NormalText>
            {a}
          </NormalText>
        </Button>
        );
    });
  },
  render() {
    var buttons = this._buttons();
    return (
      <View>
        <HeadingText>
          {this.props.prompt}
        </HeadingText>
        {buttons}
        {
          this.state.showingAnswer
          ? <ContinueButton onPress={this._continue}
                            wasCorrect={this.state.wasCorrect}/>
          : null
        }
      </View>
      );
  }
});

var styles = StyleSheet.create({
  options: {
    backgroundColor: '#AAAAAA'
  },
  continueButton: {
    backgroundColor: '#DDDDFF'
  },
  rightAnswer: {
    borderColor: '#00FF00',
    borderWidth: 4
  },
  wrongAnswer: {
    borderColor: '#FF0000',
    borderWidth: 4
  }
});

export default ViewCard;