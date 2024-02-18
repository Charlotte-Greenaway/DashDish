"use client";
import {
  Image,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Chip,
  Badge,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { FaStar, FaHeart, FaCheck } from "react-icons/fa";
import axios from "axios";
interface MyComponentProps {
  recipes: any[];
  recipeanaly: any;
  dbSavedRecipes: any[];
}
const ResultsIngs: React.FC<MyComponentProps> = ({
  recipes,
  recipeanaly,
  dbSavedRecipes,
}) => {
  const resultsRef: any = useRef(null);
  const [viewRecipes,setViewRecipes]=useState(recipes);
  const [appliedFilters, setAppliedFilters]=useState<string[]>([]);
  const { data: session, status }: any = useSession();
  const [savedStatus, setSavedStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipeanaly]);

  useEffect(() => {
    const initialSavedStatus = dbSavedRecipes.reduce((acc, recipe) => {
      acc[recipe] = true;
      return acc;
    }, {});
    setSavedStatus(initialSavedStatus);
  }, [dbSavedRecipes]);

  const saveRecipe = async (id: string) => {
    if (session && session?.user) {
      if (savedStatus[id] === true) {
        const res = await axios.post("/api/users/removeSavedRecipe", {
          id: id,
        });
        if (res.data.status == 200) {
          setSavedStatus((prev) => ({ ...prev, [id]: !prev[id] }));
        } else {
          toast.error("Could not save recipe");
        }
      } else {
        const res = await axios.post("/api/users/saveRecipe", {
          id: id,
        });
        if (res.data.status == 200) {
          setSavedStatus((prev) => ({ ...prev, [id]: !prev[id] }));
        } else {
          toast.error("Could not save recipe");
        }
      }
    } else {
      toast.error("Sign in to save recipes");
    }
  };
  const applyFilter = (filter:string) =>{
    if(!appliedFilters.includes(filter)){
      if(filter=="Most Matched" && appliedFilters.includes("Least Matched")){
        setAppliedFilters([...appliedFilters.filter(item=>item!=="Least Matched"),filter]);
      }else if(filter=="Least Matched" && appliedFilters.includes("Most Matched")){
        setAppliedFilters([...appliedFilters.filter(item=>item!=="Most Matched"),filter]);
      }else{
        setAppliedFilters([...appliedFilters,filter]);
      } 
    }
    
  }
  useEffect(() => {
    const newRecipes = appliedFilters.reduce((filteredRecipes, filter) => {
      switch (filter) {
        case "Vegan":
          return filteredRecipes.filter(item => item.diets.includes("Vegan"));
        case "Vegetarian":
          return filteredRecipes.filter(item => item.diets.includes("Vegetarian"));
        case "Gluten-Free":
          return filteredRecipes.filter(item => item.diets.includes("Gluten-free"));
        case "Most Matched":
          // Note: Sorting doesn't reduce the array size, so it's applied directly
          return [...filteredRecipes].sort((a, b) => b.matchedIngs.length - a.matchedIngs.length);
        case "Least Matched":
          return [...filteredRecipes].sort((a, b) => a.matchedIngs.length - b.matchedIngs.length);
        default:
          return filteredRecipes;
      }
    }, [...recipes]); // Start with a copy of the original recipes array
  
    setViewRecipes(newRecipes);
  }, [appliedFilters, recipes]);

  useEffect(()=>{
    setAppliedFilters([])
    setViewRecipes(recipes)
  },[recipes])
  const removeFilter = (filter:string) =>{
    setAppliedFilters(appliedFilters.filter(item=>item!==filter));
  }

  return (
    <>
      {recipeanaly && (
        <div className="show" ref={resultsRef}>
          <span className="loader mx-auto"></span>
          <span className="loader2">Loading</span>
        </div>
      )}
      {recipes.length > 0 && !recipeanaly  && (
        <div className="max-w-[700px] mx-auto mt-7 flex flex-row items-center bg-white/60 rounded-lg py-2 px-5">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" color="success">
                Filters
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="faded"
              aria-label="Dropdown menu with description"
            >
              <DropdownSection title="Sort By" showDivider>
                <DropdownItem key="most" onClick={()=>applyFilter("Most Matched")}>Most Matched Ingredients</DropdownItem>
                <DropdownItem key="least" onClick={()=>applyFilter("Least Matched")}>
                  Least Matched Ingredients
                </DropdownItem>
              </DropdownSection>
              <DropdownSection title="Filter By">
                <DropdownItem key="vegetarian" onClick={()=>applyFilter("Vegetarian")}>Vegetarian</DropdownItem>
                <DropdownItem key="vegan" onClick={()=>applyFilter("Vegan")}>Vegan</DropdownItem>
                <DropdownItem key="gluten-free" onClick={()=>applyFilter("Gluten-free")}>Gluten-free</DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
          {
            appliedFilters.map(filter=>
              <Chip key={filter} onClose={() => removeFilter(filter)} color="success" className="mx-2 py-4">{filter}</Chip>
              )
          }
        </div>
      )}
      <div className="flex flex-col lg:flex-row flex-wrap justify-center mt-10 max-w-[1150px] mx-auto items-center">
        {viewRecipes.length > 0 &&
          !recipeanaly &&
          viewRecipes[0] !== "No recipes" &&
          viewRecipes.map((item) => (
            <div className="fitcont lg:w-1/3" key={item._id}>
              <Badge
                content={
                  savedStatus[item._id] ? (
                    <FaCheck color="white" size={20} className="my-2 mx-1" />
                  ) : (
                    <FaHeart color="white" size={20} className="my-2 mx-1" />
                  )
                }
                color="danger"
                shape="circle"
                placement="top-right"
                onClick={() => saveRecipe(item._id)}
                className="cursor-pointer"
                style={{
                  transition: "color 0.3s, background-color 0.3s",
                }}
              >
                <Link
                  className="py-4 fitcont my-3 mx-1"
                  href={`/recipe?id=${item._id}&missingIngs=${
                    item.missingIngs
                  }${savedStatus[item._id] ? "&saved=true" : ""}`}
                >
                  <Card
                    className="py-4 fitcont mx-auto my-3"
                    key={item.recipeId}
                  >
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start mx-auto">
                      <p className="text-tiny uppercase font-bold mx-auto max-w-[300px] text-center truncate">
                        {item.recipeTitle}
                      </p>
                      {item.rating > 0 ? (
                        <div className="flex mx-auto my-3">
                          {Array.from({ length: item.rating }).map(
                            (_, index) => (
                              <FaStar key={index} color="gold" size={20} />
                            )
                          )}
                        </div>
                      ) : (
                        // If there are no ratings, render a message with a grey star
                        <>
                          <small className="inline mx-auto my-3">
                            <FaStar color="grey" size={20} className="inline" />{" "}
                            No Ratings
                          </small>
                        </>
                      )}
                    </CardHeader>
                    <CardBody className="overflow-visible py-2 mx-auto">
                      <div className="image-container fit-content rounded-xl">
                        <Image
                          alt="Card background"
                          className="object-cover rounded-xl mx-auto fitcont"
                          src={`data:image/[type];base64,${item.image}`}
                          width={270}
                        />
                        <div className="image-overlay rounded-xl max-h-12 overflow-hidden max-w-screen">
                          <p>{item.summary}</p>
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter>
                      <Chip color="success" variant="dot">
                        <small>
                          {item.matchedIngs.length} Matched Ingredients
                        </small>
                      </Chip>

                      <Chip color="danger" variant="dot">
                        <small>
                          {item.missingIngs.length} Missing Ingredients
                        </small>
                      </Chip>
                    </CardFooter>
                  </Card>
                </Link>
              </Badge>
            </div>
          ))}
        {viewRecipes[0] == "No recipes" && !recipeanaly && (
          <h1 className="text-2xl text-bold">No results</h1>
        )}
      </div>
    </>
  );
};

export default ResultsIngs;
