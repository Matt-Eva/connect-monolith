import Root from "./root/Root.jsx";
import BrowseChats from "./pages/browse-chats/BrowseChats.jsx";
import MyChats from "./pages/my-chats/MyChats.jsx";
import NewChat from "./pages/new-chat/NewChat.jsx";
import Search from "./pages/search/Search.jsx";
import MyConnections from "./pages/my-connections/MyConnections.jsx";
import NewConnections from "./pages/new-connections/NewConnections.jsx";
import Chat from "./pages/chat/Chat.jsx";
import Login from "./pages/login/Login.jsx"
import CreateAccount from "./pages/createAccount/CreateAccount.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import MyInvitations from "./pages/MyInvitations/MyInvitations.jsx";
import Account from "./pages/Account/Account.jsx";
import About from "./pages/About/About.jsx";

const routes = [
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <BrowseChats />,
                children: [
                    {
                        path: '/',
                        element: <MyChats />
                    },
                    {
                        path: '/new-chat',
                        element: <NewChat />
                    } 
                ]
            },
            {
                path: '/people',
                element: <Search />,
                children: [
                  {
                    path: "/people",
                    element: <NewConnections />
                  },
                  {
                    path: "/people/my-connections",
                    element: <MyConnections />
                  },
                  {
                    path: "/people/invitations",
                    element: <MyInvitations />
                  }
                ]
            }, 
            {
                path: '/chat/:id',
                element: <Chat />
            }, 
            {
                path: "/login",
                element: <Login />
            }, 
            {
                path: "/new-account",
                element: <CreateAccount />
            }, 
            {
                path: "/profile/:id",
                element: <ProfilePage />
            },
            {
                path: "/account",
                element: <Account />
            }
        ]
    }, 
    {
        path: "/about",
        element: <About />
    }
]

export default routes;