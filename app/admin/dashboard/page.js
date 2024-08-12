"use client";
import { getallFeedbacks, getRatings } from "@/app/_lib/data-service";
import GridCard from "@/app/_components/Backend/GridCard";
import GridItem from "@/app/_components/Backend/GridItem";
import { useAuth } from "@/app/_context/AuthContext";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import ChatPopup from "@/app/_components/ChatPopup";

function Dashboard() {
  const { user, loading } = useAuth();
  const [loadData, setLoadData] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  const getData = async () => {
    const feed = await getallFeedbacks();
    const { avgRate } = await getRatings();

    return { feed, avgRate };
  };
  useEffect(() => {
    const fetchData = async () => {
      const { feed, avgRate } = await getData();
      setFeedbacks(feed || []);
      setRatings(avgRate);
    };

    fetchData();
  }, []);

  return (
    <>
      {" "}
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
              imgUrl="https://static.vecteezy.com/system/resources/previews/016/016/742/non_2x/transparent-like-feedback-icon-free-png.png"
              total={feedbacks.length}
              title="Total Feedbacks"
            />
          </GridCard>
          <GridCard loading={loading} loadData={loadData}>
            <GridItem
              imgUrl="https://uxwing.com/wp-content/themes/uxwing/download/e-commerce-currency-shopping/hand-with-star-icon.png"
              total={13}
              title="Average Rating"
            />
          </GridCard>
          <GridCard loading={loading} loadData={loadData}>
            <GridItem
              imgUrl="https://th.bing.com/th/id/R.cfe4a5b86f6cd5d0a1908966ec4681ed?rik=WmZWTZegirpqXw&riu=http%3a%2f%2fdesignlooter.com%2fimages%2fstar-svg-9.png&ehk=VEkCyZ2irgt8q4UOz868nPv5IedTGW%2fw%2b0PFwY3%2b3%2fs%3d&risl=&pid=ImgRaw&r=0"
              total={13}
              title="Total Stars"
            />
          </GridCard>
          <GridCard loading={loading} loadData={loadData}>
            <GridItem
              imgUrl="https://th.bing.com/th/id/OIP.n1Ou9pCSKinqr71hrJ3cVwHaHa?rs=1&pid=ImgDetMain"
              total={12}
              title="Total Complains"
            />
          </GridCard>
        </Grid>
      </Grid>
      <ChatPopup />
    </>
  );
}

export default Dashboard;
