import Box from '@material-ui/core/Box';

function Tools({ children, className }) {
  return (
    <Box
      className={className}
      display="flex"
      justifyContent="space-between"
      flexWrap="wrap"
    >
      {children}
    </Box>
  );
}

export default Tools;
