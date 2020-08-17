import cx from 'clsx';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import copy from 'copy-to-clipboard';

const useStyles = makeStyles(() => ({
  emailButton: { paddingTop: 0, paddingBottom: 0 },
  dividerWithText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .divider': {
      flex: 1,
    },
    '& .text': {
      textAlign: 'center',
      padding: '10px 10px',
    },
  },
  label: {
    // Aligns the content of the button vertically.
    flexDirection: 'column',
    textTransform: 'none',
  },
}));

export function ButtonIcon({ children, icon, onClick }) {
  const classes = useStyles();
  return (
    <Button
      /* Use classes property to inject custom styles */
      classes={{ label: classes.label }}
      color="primary"
      onClick={() => onClick()}
    >
      <img src={icon} height={44} width={44} />
      <Typography variant="caption" color="textSecondary">
        {children}
      </Typography>
    </Button>
  );
}

export function ListItemLink({ href, children, icon, onClick, email = false }) {
  const classes = useStyles();
  return (
    <CustomListItem
      button
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx({ [classes.emailButton]: email })}
      onClick={onClick}
    >
      <ListItemIcon>
        <img src={icon} height={28} width={28} />
      </ListItemIcon>
      {children}
    </CustomListItem>
  );
}

export function ListItemCopy({ children, icon, textToCopy, onSuccess }) {
  const handleClickEvent = () => {
    if (copy(textToCopy)) {
      if (typeof onSuccess === 'function') onSuccess();
    }
  };

  return (
    <CustomListItem button onClick={handleClickEvent}>
      <ListItemIcon>
        <img src={icon} height={28} width={28} />
      </ListItemIcon>
      <ListItemText>{children}</ListItemText>
    </CustomListItem>
  );
}

export function DividerWithText({ children }) {
  const classes = useStyles();
  return (
    <div className={classes.dividerWithText}>
      <Divider className="divider" />
      <Typography className="text" variant="body2" color="textSecondary">
        {children}
      </Typography>
      <Divider className="divider" />
    </div>
  );
}

const CustomListItem = withStyles({
  gutters: { paddingLeft: '25px', paddingRight: '25px' },
})(ListItem);
