"use client";
import { getallFeedbacks, getRatings } from "@/app/_lib/data-service";
import GridCard from "@/app/_components/Backend/GridCard";
import GridItem from "@/app/_components/Backend/GridItem";
import { useAuth } from "@/app/_context/AuthContext";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";

function Dashboard() {
  const { user, loading } = useAuth();
  const [loadData, setLoadData] = useState(false);
  const [ratings,setRatings]=useState(0)
  const [feedbacks,setFeedbacks]=useState([])


 const getData= async ()=>{
  const feed=await getallFeedbacks()
  const {avgRate}=await getRatings()
   
  return {feed,avgRate}


 }
 useEffect(() => {
  const fetchData = async () => {
    const { feed, avgRate } = await getData();
    setFeedbacks(feed || []);
    setRatings(avgRate);
  };

  fetchData();
}, []);


  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        md={12}
        lg={12}
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
            lg: "row",
          },
        }}
      >
        <GridCard loading={loading} loadData={loadData}>
          <GridItem
            imgUrl="/images/box.png"
            total={feedbacks.length}
            title="Total Feedbacks"
          />
        </GridCard>
        <GridCard loading={loading} loadData={loadData}>
          <GridItem
            imgUrl="/images/list-items.png"
            total={13}
            title="Average Rating"
          />
        </GridCard>
        <GridCard loading={loading} loadData={loadData}>
          <GridItem
            imgUrl="/images/low.png"
            total={13}
            title="Total Stars"
          />
        </GridCard>
        <GridCard loading={loading} loadData={loadData}>
          <GridItem
            imgUrl="/images/expired.png"
            total={12}
            title="Total Complains"
          />
        </GridCard>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
