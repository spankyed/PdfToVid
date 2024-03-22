import Box from '@mui/material/Box';

const height = 'calc(100vh - 65px)'

const PageLayout = ({ children, compact = true, ...props }) => {
  return (
    <Box
      sx={{
        overflowY: 'auto',
        flexGrow: 1,
        height,
        justifyContent: 'center',
        display: 'flex',
    }}
      {...props}
    >
      <div
        style={{
          width: compact ? '90%' : '98%',
          display: 'flex',
          flexDirection: 'column',
          padding: compact ? 2 : 4,
        }}
      >
        {children}
      </div>
    </Box>
  );
};

export default PageLayout;
