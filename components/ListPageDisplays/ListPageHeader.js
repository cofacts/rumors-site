import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

function ListPageHeader({ title, children, className }) {
  return (
    <Box
      className={className}
      display="flex"
      alignItems="center"
      justifyContent={{ xs: 'center', md: 'space-between' }}
      flexDirection={{ xs: 'column', md: 'row' }}
      mb={2}
    >
      <Typography variant="h4">{title}</Typography>
      <Box my={1}>{children}</Box>
    </Box>
  );
}

export default ListPageHeader;
