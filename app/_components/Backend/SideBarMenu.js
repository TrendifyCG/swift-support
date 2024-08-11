import { useSupport } from "@/app/_context/SupportContext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";

function SideBarMenu({ toggleDrawer }) {
  const { state } = useSupport();
  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        {state.drawerOpen && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mr: 4, alignItems: "center" }}
          >
            <Avatar
              src="/images/logo.png"
              alt="Swift Support Logo"
              sx={{ width: 30, height: 30 }}
            />
            <Typography variant="h6" color="text.primary" fontWeight="bold">
              Swift Support
            </Typography>
          </Stack>
        )}
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <Link href="/admin/dashboard">
          <ListItemButton
            sx={{
              justifyContent: state.drawerOpen ? "flex-start" : "center",
              paddingBottom: "15px",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: state.drawerOpen ? "56px" : "0px",
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              sx={{
                display: state.drawerOpen ? "block" : "none",
              }}
            />
          </ListItemButton>
        </Link>
        <Divider sx={{ my: 1 }} />
      </List>
    </>
  );
}

export default SideBarMenu;
