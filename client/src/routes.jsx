import Root from "./root/Root.jsx";
import BrowseChats from "./pages/BrowseChats/BrowseChats.jsx";
import MyChats from "./pages/MyChats/MyChats.jsx";
import NewChat from "./pages/NewChat/NewChat.jsx";
import People from "./pages/People/People.jsx";
import MyConnections from "./pages/MyConnections/MyConnections.jsx";
import Search from "./pages/Search/Search.jsx";
import Chat from "./pages/Chat/Chat.jsx";
import Login from "./pages/Login/Login.jsx";
import CreateAccount from "./pages/CreateAccount/CreateAccount.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import MyInvitations from "./pages/MyInvitations/MyInvitations.jsx";
import Account from "./pages/Account/Account.jsx";
import AccountInfo from "./pages/AccountInfo/AccountInfo.jsx";
import EditAccountForm from "./pages/EditAccountForm/EditAccountForm.jsx";
import UpdateProfileImage from "./pages/UpdateProfileImage/UpdateProfileImage.jsx";
import About from "./pages/About/About.jsx";
import GetApp from "./pages/GetApp/GetApp.jsx";
import Donate from "./pages/Donate/Donate.jsx";
import EnableNotifications from "./pages/EnableNotifications/EnableNotifications.jsx";

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
