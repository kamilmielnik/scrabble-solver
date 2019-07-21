import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectCharactersStatistics, selectNumberOfRemainingCharacters } from 'remaining-tiles/selectors';
import Section from 'components/section';
import { Message } from 'i18n';

import Tile from './tile';
import styles from './remaining-tiles.module.scss';

const RemainingTiles = ({ className, charactersStatistics, numberOfTiles }) => (
  <Section
    className={className}
    id="remaining-tiles"
    label={
      <Message
        id="modules.remaining-tiles.label"
        values={{
          numberOfTiles: String(numberOfTiles)
        }}
      />
    }
  >
    <div className={styles.remainingTiles}>
      {charactersStatistics.map((tile) => (
        <Tile key={tile.character} {...tile} />
      ))}
    </div>
  </Section>
);

RemainingTiles.propTypes = {
  charactersStatistics: PropTypes.array.isRequired,
  className: PropTypes.string,
  numberOfTiles: PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
  charactersStatistics: selectCharactersStatistics(state),
  numberOfTiles: selectNumberOfRemainingCharacters(state)
});

export default connect(mapStateToProps)(RemainingTiles);
