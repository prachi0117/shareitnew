
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Topbar from "../../components/topbar/Topbar";
import "./home.css"

export default function Home() {
  return (
    <>
    
       <Topbar/>
       <div className="homeContainer">
        <Sidebar />
         <Feed/> 
         <Rightbar/> 
      </div>
        
    </>
  );
}

/*1.reload
  2.comment
  3.update profile
  4.search
 */