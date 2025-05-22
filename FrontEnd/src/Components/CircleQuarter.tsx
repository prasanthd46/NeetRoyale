import React from 'react'



const CircleQuarter = ({flag,rotate}:{flag:boolean,rotate:boolean}) => {
  return ( <div className={`rounded-xl  flex flex-col ${rotate? 'animate-spin duration-1000':''} transition-transform duration-800 ${flag===true?"rotate-45   gap-[1px]":" "}  gap-[3px] shadow-[0_0_15px_rgba(168,85,247,0.7),0_0_30px_rgba(168,85,247,0.6)] filter brightness-200`}>
            <div className="flex rounded  gap-[3px]">
                  <div className="bg-gray-500 w-2 h-2 rounded-tl-2xl">

                  </div>
                  <div className="bg-gray-500 w-2 h-2 rounded-tr-2xl">

                  </div>
            </div>
            <div className="flex rounded gap-[3px]  ">
                  <div className="bg-gray-500 w-2 h-2 rounded-bl-2xl  ">

                  </div>
                  <div className="bg-gray-500 w-2 h-2 rounded-br-2xl">

                  </div>
           
            </div>
          </div>
    
  )
}

export default CircleQuarter