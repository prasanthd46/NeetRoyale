import react from "react"

const Navbar = ()=>{
    // return <div className="h-20 text-white bg-white/5 backdrop-blur-lg rounded-xl ring-1 ring-white/40">
    //     <div className="flex items-center justify-center h-full">
    //         <div className="flex justify-between w-full pl-20 pr-10"> 
                
    //             <div>
    //                 hi
    //             </div>
    //             <div>   
    //                 end
    //             </div>

    //         </div>
    //     </div>
    // </div>
    return <div className="flex text-white   justify-between items-center h-20 overflow-x-hidden">
        <div className="text-[35px]  font-extrabold rounded-r-full w-[20%] h-[90%] flex justify-center items-center mt-2">
                NeetRoyale
        </div>
        <div className=" rounded-l-full w-[14%] h-10 gap-6 flex justify-center items-center mt-2 mr-10">
                <div className=" w-[60%] h-10  hover:bg-white/10 rounded-full font-medium flex justify-center items-center cursor-pointer text-md tracking-wide">
                    Getting Started
                </div>
                <div className="ring-[3px] hover:bg-white hover:text-black w-[30%] h-10 items-center font-medium  rounded-full flex justify-center text-md tracking-wide cursor-pointer">
                    Login
                </div>
        </div>
    </div>
}
export default Navbar 