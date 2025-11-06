import { dummyShowsData } from "../assets/assets"
import BlurCircle from "../components/BlurCircle"
import MomviCard from "../components/MomviCard"


const Favorite = () => {
  return dummyShowsData.length > 0 ? (
    <div className="relative my-40 mb-20 px-6 md:px-16 lg:px-40 xl:px-44
    overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>
      <h1 className="text-lg font-medium my-4">Your Favorite Movis</h1>
      <div className=" flex flex-wrap max-sm:justify-center gap-6">
        {dummyShowsData.map((movie)=>(
          <MomviCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1  className="text-3lx font-bold text-center">No moview Available</h1>
    </div>
  )
}

export default Favorite