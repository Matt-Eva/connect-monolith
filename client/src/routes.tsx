import Root from "./root/Root";
import BrowseChats from "./pages/BrowseChats/BrowseChats";
import MyChats from "./pages/MyChats/MyChats";
import NewChat from "./pages/NewChat/NewChat";
import People from "./pages/People/People";
import MyConnections from "./pages/MyConnections/MyConnections";
import Search from "./pages/Search/Search";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import CreateAccount from "./pages/CreateAccount/CreateAccount";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MyInvitations from "./pages/MyInvitations/MyInvitations";
import Account from "./pages/Account/Account";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import EditAccountForm from "./pages/EditAccountForm/EditAccountForm";
import UpdateProfileImage from "./pages/UpdateProfileImage/UpdateProfileImage";
import About from "./pages/About/About";
import GetApp from "./pages/GetApp/GetApp";
import Donate from "./pages/Donate/Donate";
import EnableNotifications from "./pages/EnableNotifications/EnableNotifications";

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <BrowseChats />,
        children: [
          {
            path: "/",
            element: <MyChats />,
          },
          {
            path: "/new-chat",
            element: <NewChat />,
          },
        ],
      },
      {
        path: "/people",
        element: <People />,
        children: [
          {
            path: "/people",
            element: <Search />,
          },
          {
            path: "/people/my-connections",
            element: <MyConnections />,
          },
          {
            path: "/people/invitations",
            element: <MyInvitations />,
          },
        ],
      },
      {
        path: "/chat/:id",
        element: <Chat />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/new-account",
        element: <CreateAccount />,
      },
      {
        path: "/profile/:id",
        element: <ProfilePage />,
      },
      {
        path: "/account",
        element: <Account />,
        children: [
          {
            path: "/account",
            element: <AccountInfo />,
          },
          {
            path: "/account/edit",
            element: <EditAccountForm />,
          },
          {
            path: "/account/edit-image",
            element: <UpdateProfileImage />,
          },
          {
            path: "/account/enable-notifications",
            element: <EnableNotifications />,
          },
        ],
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/get-app",
        element: <GetApp />,
      },
      {
        path: "/donate",
        element: <Donate />,
      },
    ],
  },
];

export default routes;
