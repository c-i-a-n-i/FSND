import MoiveThumbnail from "./MovieThumbnail";
import ActorThumbnail from "./ActorThumbnail";
import FlipMove from "react-flip-move";

const Results = ( {results, type} ) => {
  return (
  <FlipMove className="px-5 my-10 sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap justify-center">
      {
        type === "actors"?
          results.map(result => (
            <ActorThumbnail key={result.id} result={result}/>
        ))
          :results.map(result => (
            <MoiveThumbnail key={result.id} result={result}/>
        ))
      }
  </FlipMove>
  );
};

export default Results;
