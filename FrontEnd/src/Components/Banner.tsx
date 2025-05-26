import React from 'react'



const Banner = () => {
  const bannerArray = [
    "Screenshot-2025-05-25-172741.png",
    "Screenshot-2025-05-25-172704.png",
    "Screenshot-2025-05-25-172957.png",
    'Screenshot-2025-05-25-173033.png',
    "Screenshot-2025-05-25-173049.png",
    "Screenshot-2025-05-25-173124.png",
    "Screenshot-2025-05-25-173131.png",
    "Screenshot-2025-05-25-173140.png",
    "Screenshot-2025-05-25-173201.png",
    "Screenshot-2025-05-25-173215.png",
    "Screenshot-2025-05-25-173224.png",
  ]
  function getRandomBanner() {
  const randomIndex = Math.floor(Math.random() * bannerArray.length);
  return bannerArray[randomIndex];
}
  return (
    <div className="border-2 rounded border-white/10 w-50 flex h-[400px]">
        <img className="w-full  " src={getRandomBanner()} alt=""></img>
    </div>
  )
}

export default Banner