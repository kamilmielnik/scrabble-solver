import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  selectCharactersStatistics,
  selectNumberOfRemainingCharacters
} from 'remaining-tiles/selectors';
import Section from 'components/section';
import { getTileClassNames } from './tile-classnames';
import styles from './styles.scss';

const RemainingTiles = ({ className, charactersStatistics, label }) => (
  <Section className={className} label={label}>
    <div className={styles.remainingTiles}>
      {charactersStatistics.map(({ character, count, points, usedCount }) => (
        <div
          key={character}
          className={classNames(
            styles.tile,
            getTileClassNames({ count, points, usedCount }),
            {
              [styles.error]: usedCount > count,
              [styles.noMoreLeft]: usedCount === count
            }
          )}>
          <div className={styles.character}>
            {`${character.toUpperCase()}`}
          </div>
          <div>
            {`${count - usedCount}/${count}`}
          </div>
        </div>
      ))}
    </div>
  </Section>
);

RemainingTiles.propTypes = {
  charactersStatistics: PropTypes.array.isRequired,
  className: PropTypes.string,
  label: PropTypes.string.isRequired
};

const mapStateToProps = (state, { intl }) => ({
  charactersStatistics: selectCharactersStatistics(state),
  label: intl.formatMessage({ id: 'modules.remaining-tiles.label' }, {
    numberOfTiles: String(selectNumberOfRemainingCharacters(state))
  })
});

export default injectIntl(connect(mapStateToProps)(RemainingTiles));
