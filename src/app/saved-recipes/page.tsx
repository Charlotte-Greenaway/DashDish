"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoginSection from "../components/loginComponent";
import RecipeWidget from "../components/recipeWidget";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface Recipe {
  _id: number;
  recipeId: string;
  recipeTitle: string;
  rating: number;
  image: {
    data: string;
  };
  summary: string;
}
const SavedRecipes = () => {
  const { data: session }: any = useSession();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isAnalysing, setIsAnalysing] = useState<boolean>(false);
  const getUserSavedRecipes = async () => {
    const recipes = await axios.post("/api/users/getUserSavedRecipes");
    if (recipes.data.status == 200) {
      setSavedRecipes(recipes.data.message);
    } else {
      toast.error("Could not get saved recipes.");
    }
    setIsAnalysing(false);
  };
  useEffect(() => {
    if (session && session?.user) {
      if (savedRecipes.length < 1) {
        setIsAnalysing(true);
      }
      getUserSavedRecipes();
    }
  }, [session?.user]);
  if (session && session?.user) {
    return (
      <>
        {isAnalysing ? (
          <>
            <div id="cooking">
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div className="bubble"></div>
              <div id="area">
                <div id="sides">
                  <div id="pan"></div>
                  <div id="handle"></div>
                </div>
                <div id="pancake">
                  <div id="pastry"></div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-6 max-w-[1150px] mx-auto bg-white">
              {/* Content for logged-in users */}
              <h2 className="text-3xl text-center md:text-4xl font-bold text-green-900 mb-4 mt-2 shadow-md p-3 rounded-lg bg-green-50 border-l-4 border-green-400">
                Your Saved Recipes
              </h2>

              <div className="flex flex-col lg:flex-row flex-wrap justify-start items-center">
                {savedRecipes.length > 0 ? (
                  savedRecipes.map((item) => (
                    <RecipeWidget key={item._id} recipe={item} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full my-4">
                    <h3 className="text-xl text-center text-gray-800">
                      Add recipes to favourites to fill this area
                    </h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20em"
                      height="20em"
                      viewBox="0 0 713.52567 614.00006"
                    >
                      <g>
                        <path
                          id="uuid-25964adc-e6e4-4b9a-b8ec-929b0c1831fb-5094"
                          d="m347.87323,451.90152c16.98547,5.29892,28.0195,18.35818,24.64548,29.1673-3.37405,10.80911-19.87653,15.27332-36.86734,9.97025-6.81619-2.02527-13.04828-5.65344-18.1748-10.58099l-71.68465-23.36063,11.67949-33.40585,69.42838,26.57608c7.02133-1.13821,14.21317-.578,20.97348,1.63382l-.00003.00003Z"
                          fill="#ffb6b6"
                        />
                        <path
                          d="m194.30498,206.79003h-.00006c-17.0927-2.02448-32.8309,9.528-36.01506,26.44307-11.35732,60.33289-35.47932,190.79974-32.30268,193.97641,4.13558,4.13559,158.53068,49.62698,158.53068,49.62698l17.92087-38.59879-102.01105-49.62698,22.37239-144.3019c2.84016-18.31905-10.08585-35.33842-28.49509-37.51881v.00002Z"
                          fill="#e6e6e6"
                        />
                      </g>
                      <g>
                        <path
                          id="uuid-a5d71dbf-4b88-4e86-8463-d776047f9b39-5095"
                          d="m380.31247,514.65845c-16.57343,6.47351-33.34772,3.16943-37.46579-7.37866s5.97897-24.34344,22.55917-30.81708c6.58765-2.67679,13.72052-3.73706,20.80191-3.09204l70.56866-26.54187,11.74945,33.38129-70.81561,22.62152c-4.77151,5.27515-10.73724,9.33063-17.39777,11.82684h-.00003Z"
                          fill="#a0616a"
                        />
                        <path
                          d="m482.07956,228.14661h.00006c16.918-3.16853,33.39694,7.3002,37.71066,23.96306,15.38605,59.4333,48.22101,187.98421,45.26501,191.36714-3.84833,4.40414-154.83734,60.16818-154.83734,60.16818l-20.47421-37.30722,98.4455-56.37003-32.01898-142.47226c-4.06479-18.08678,7.68829-35.93631,25.90939-39.34889l-.00009.00002Z"
                          fill="#e6e6e6"
                        />
                      </g>
                      <polygon
                        points="182.19685 215.45674 190.60481 162.90703 133.85113 139.78516 125.44317 219.66072 182.19685 215.45674"
                        fill="#ffb6b6"
                      />
                      <polygon
                        points="513.66339 223.72791 505.25546 171.17821 562.00915 148.05634 570.41711 227.93189 513.66339 223.72791"
                        fill="#a0616a"
                      />
                      <g>
                        <circle
                          cx="167.85481"
                          cy="121.92467"
                          r="57.8752"
                          fill="#ffb6b6"
                        />
                        <path
                          d="m163.23585,44.11551c1.67468.97758,3.91788-.50148,4.45485-2.36477s-.08853-3.84161-.70883-5.67885l-3.12267-9.24891c-2.21466-6.55954-4.56517-13.34829-9.36159-18.34095C147.25819.94643,135.75307-.9706,125.39614.41822c-13.30033,1.78351-26.42318,8.9855-32.60744,20.89493-6.18426,11.90943-3.55139,28.52735,7.62317,35.95763-15.92619,18.25407-21.47782,38.5976-20.60124,62.80681s27.2587,46.48959,44.46336,63.54404c3.84212-2.32903,7.33504-13.2439,5.22223-17.20903-2.1128-3.96513.91437-8.55885-1.70228-12.21117-2.61665-3.65231-4.8058,2.16325-2.16043-1.46831,1.66927-2.29158-4.84585-7.56354-2.36458-8.93507,12.00146-6.63399,15.99306-21.5933,23.53075-33.04879,9.09186-13.81745,24.65257-23.17476,41.11992-24.72714,9.07129-.85515,18.65257.6937,26.08797,5.96006s12.24902,14.67727,10.52483,23.62416c4.46538-4.53399,6.68816-11.17856,5.84978-17.48679s-4.7195-12.14158-10.21411-15.35187c3.34096-11.04836.47887-23.7572-7.27567-32.3068-7.75452-8.5496-39.21107-7.09344-50.53209-4.84334"
                          fill="#2f2e41"
                        />
                        <path
                          d="m161.47775,86.35749c-14.99432,1.61864-25.82066,14.60707-34.9626,26.60187-5.2692,6.91353-10.78864,14.54836-10.65635,23.23995.13374,8.78745,6.00904,16.32458,8.81694,24.6524,4.58959,13.61208.1165,29.80731-10.80879,39.13422,10.79542,2.04855,22.46555-6.04584,24.32919-16.87471,2.16949-12.60612-7.38655-24.77298-6.25481-37.51428.99709-11.22523,9.84303-19.86437,17.36342-28.25745,7.52039-8.39308,14.58333-19.53049,11.12357-30.25569"
                          fill="#2f2e41"
                        />
                      </g>
                      <path
                        d="m188.75362,206.64507l-65.52348-17.92085-67.54786,27.57056-28.94908,228.8356,165.42333,5.5141v-36.91089s28.94908-36.15106,23.43497-88.53513l-5.51411-52.38406-21.32376-66.16933Z"
                        fill="#e6e6e6"
                      />
                      <path
                        d="m219.0378,299.69568l-129.5816-6.89264-35.15246,99.94327S10.88012,452.71225,3.98748,496.82517c-6.89264,44.11295-2.75706,106.14664-2.75706,106.14664h207.45214l-16.52605-189.23822s38.58249-83.71027,34.11043-98.18481c-4.47208-14.47455-7.22913-15.85306-7.22913-15.85306l-.00002-.00003Z"
                        fill="#3f3d56"
                      />
                      <rect
                        x="88.07767"
                        y="189.41347"
                        width="31.70614"
                        height="117.17485"
                        fill="#3f3d56"
                      />
                      <rect
                        x="185.95312"
                        y="215.6055"
                        width="31.70615"
                        height="96.49695"
                        fill="#3f3d56"
                      />
                      <path
                        d="m504.34961,217.6733l65.5235-17.92085,67.54785,27.57056,28.9491,228.8356-165.42334,5.5141v-36.91089s-16.92203-37.73605-.68927-87.84586c15.85309-48.93774-17.2316-53.0733-17.2316-53.0733l21.32376-66.16933v-.00003Z"
                        fill="#e6e6e6"
                      />
                      <path
                        d="m474.06543,310.72391l129.5816-6.89264,35.15247,99.94327s21.36719,68.23712,28.25983,112.35004,24.81348,97.87549,24.81348,97.87549h-207.45215l-6.21967-181.96564-4.13559-121.31042.00003-.00009Z"
                        fill="#3f3d56"
                      />
                      <rect
                        x="573.31946"
                        y="200.44168"
                        width="31.70612"
                        height="117.17484"
                        fill="#3f3d56"
                      />
                      <rect
                        x="475.44397"
                        y="226.63376"
                        width="31.70615"
                        height="96.49692"
                        fill="#3f3d56"
                      />
                      <circle
                        cx="526.48047"
                        cy="115.35628"
                        r="72.48663"
                        fill="#a0616a"
                      />
                      <path
                        d="m597.77972,154.67856s-35.0697-42.08368-49.09766-38.57671-5.26044,8.76743-5.26044,8.76743l-35.06973-38.57671s-28.05579-10.52092-54.35809,22.79533c0,0-15.78137-28.05579,0-43.83717,15.78137-15.78138,21.04184-14.02789,24.5488-22.79533,3.50696-8.76743,28.05579-15.78138,28.05579-15.78138,0,0-1.40833-12.61958,6.30981-6.30979,7.71808,6.30979,26.99268,6.30979,26.99268,6.30979,0,0,.11047-7.01395,7.95282,0s16.6098,3.50697,16.6098,3.50697c0,0,0,12.13634,6.13721,12.20537s16.65814-8.6984,18.41162-1.68445,14.02789,10.52092,15.78137,31.56276-7.01398,82.41389-7.01398,82.41389Z"
                        fill="#2f2e41"
                      />
                      <g>
                        <path
                          d="m328.94202,262.86866l56.12152,106.095-7.69296,4.0694-56.12152-106.095c-.81461-1.54001-.22571-3.45166,1.3143-4.26627l2.1124-1.1174c1.54001-.81461,3.45166-.22571,4.26627,1.3143v-.00003Z"
                          fill="#3f3d56"
                        />
                        <path
                          d="m422.44043,409.05951c-14.2782-3.68146-29.21545,2.83707-36.38034,15.72446-8.97168,16.1373-19.22116,29.37582-15.789-2.17569,3.77844-34.73483-16.59909-62.78934-.58472-71.26053,16.0144-8.47119,32.55023,17.2739,58.57797,40.58359,24.12268,21.60361,10.2121,21.26285-5.82388,17.12814l-.00003.00003Z"
                          fill="#3f3d56"
                        />
                      </g>
                      <g>
                        <path
                          id="uuid-cca3ea91-4b8f-4d88-9418-fea0098b5ff4-5096"
                          d="m339.79602,284.33167c16.18549-7.39023,33.11832-5.02933,37.81979,5.27197,4.70151,10.30133-4.60828,24.63968-20.80051,32.0304-6.42764,3.04099-13.49008,4.4985-20.59644,4.25049l-68.974,30.44666-13.59779-32.672,69.43977-26.54626c4.46906-5.53372,10.19864-9.91644,16.70917-12.78122v-.00003Z"
                          fill="#ffb6b6"
                        />
                        <path
                          d="m61.84531,204.29254l-.00005.00005c-14.0799,9.90024-18.08976,29.0071-9.17169,43.72871,31.80911,52.50931,100.92059,165.76599,105.40634,166.01147,5.83986.31961,151.17784-68.84827,151.17784-68.84827l-12.41574-40.70471-109.0882,31.12646-79.64805-122.39177c-10.11128-15.53757-31.09605-19.58478-46.26045-8.922,0,0,0,.00005,0,.00005Z"
                          fill="#e6e6e6"
                        />
                      </g>
                      <path
                        d="m346.69339,447.26795l186.43765-98.62067,22.88647,43.26581c19.74213,37.32156,5.46991,83.65002-31.85168,103.39218l-51.19373,27.08017c-37.32156,19.74213-83.65005,5.46985-103.39218-31.85172l-22.88651-43.26581h0v.00003h-.00003Z"
                        fill="#20c536"
                      />
                      <path
                        id="uuid-f7f7485f-a1d4-48b6-9f93-907c0610bac7-5097"
                        d="m504.6488,513.56c-16.18442,7.39258-33.11755,5.03418-37.82056-5.26645s4.60468-24.64035,20.79584-32.03342c6.42719-3.04193,13.48941-4.50046,20.59583-4.25348l68.96954-30.4567,13.60254,32.67001-69.43591,26.55637c-4.46826,5.53439-10.1972,9.91794-16.70731,12.78366h.00003Z"
                        fill="#a0616a"
                      />
                      <path
                        d="m644.92218,221.95383h.00006c17.09271-2.02448,32.83087,9.528,36.01508,26.44307,11.3573,60.3329,35.47931,190.79976,32.30267,193.97639-4.13556,4.13559-158.5307,49.62701-158.5307,49.62701l-17.92084-38.59879,102.01105-49.62698-22.37238-144.30188c-2.84015-18.31905,10.08588-35.33842,28.49506-37.51881v-.00002Z"
                        fill="#e6e6e6"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <Toaster />
            </div>
          </>
        )}
      </>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            Access Saved Recipes
          </h2>
          <p className="text-green-700 mb-6">
            Log in or sign up to view, add, or remove your saved recipes and
            explore more delicious options!
          </p>
          <LoginSection />
        </div>
      </div>
    );
  }
};

export default SavedRecipes;
