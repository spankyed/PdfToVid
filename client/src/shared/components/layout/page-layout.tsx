import Box from '@mui/material/Box';

const height = 'calc(100vh - 65px)'

const PageLayout = ({ children, ...props }) => {
  return (
    <Box
      sx={{ overflowY: 'auto', flexGrow: 1, height }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default PageLayout;
