
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import react, { useEffect } from "react"

const Navbar = ()=>{
    const { loginWithRedirect, logout, user, isAuthenticated,getAccessTokenSilently} = useAuth0();
    
 useEffect(()=>{
     const syncUser = async () => {
      if (!user || !isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        console.log(user.email)
        await axios.post(
          'http://localhost:3000/api/user/usersave',
          {
            username: user.nickname || user.name,
            email: user.email,
            name: user.name,
            picture: user.picture,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('✅ User synced');
      } catch (err) {
        console.error('❌ Sync failed:', err);
      }
    };
    console.log("here in syncUser")
    syncUser();
  }, [user, isAuthenticated, getAccessTokenSilently]);
    
    return <div className="flex text-white   justify-between items-center h-20 overflow-x-hidden">
        <div className="text-[35px]  font-extrabold rounded-r-full w-[20%] h-[90%] flex justify-center items-center mt-2">
                NeetRoyale
        </div>
        <div className=" rounded-l-full h-10 gap-6 flex justify-center items-center mt-2 mr-10">
                <div className="px-3 h-10  hover:bg-white/10 rounded-full font-medium flex justify-center items-center cursor-pointer text-md tracking-wide">
                    Getting Started
                </div>
               {!isAuthenticated ? (
          <div
            onClick={() => loginWithRedirect().catch(err => console.error('Login failed:', err))}
            className="ring-[3px] hover:bg-white hover:text-black px-2 h-10 items-center font-medium rounded-full flex justify-center text-md tracking-wide cursor-pointer"
          >
            Login
          </div>
        ) : (
          <>
            {user?.picture && (
              <img
                src={user.picture}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="ring-[2px] hover:bg-white  hover:text-black px-2 h-10 items-center font-medium rounded-full flex justify-center text-md tracking-wide cursor-pointer"
            >
              Logout
            </div>
          </>
        )}
        </div>
    </div>
}
export default Navbar 