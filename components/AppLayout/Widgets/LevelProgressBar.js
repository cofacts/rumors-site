import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {},
  progressBar: {
    border: `1px solid ${theme.palette.secondary[300]}`,
    borderRadius: 10,
    height: 14,
  },
  progress: {
    display: 'block',
    margin: 1,
    width: percent => `${percent}%`,
    backgroundColor: theme.palette.primary[500],
    borderRadius: 10,
    height: 10,
  },
}));

function LevelProgressBar({ user, className }) {
  const currentExp = user ? user.points.total - user.points.currentLevel : 0;
  const levelExp = user
    ? (user.points.nextLevel || Infinity) - user.points.currentLevel
    : Infinity;
  const classes = useStyles((currentExp / levelExp) * 100);
  return (
    !!user && (
      <div className={cx(classes.root, className)}>
        <div
          className={classes.progressBar}
          title={`${currentExp} / ${levelExp}`}
        >
          <i className={classes.progress} />
        </div>
      </div>
    )
  );
}

export default LevelProgressBar;
