function WalledGrid({ grid }) {
    let divs = [];
    for(let i = 0; i < 21; i++) {
        for(let j = 0; j < 21; j++) {
            if(i % 2 === 0) {
                if(j % 2 === 0) {
                    divs.push(<div key={21 * i + j}></div>);
                }
                else {
                    divs.push(<div key={21 * i + j} className={"rounded" + (grid.horizontalWalls[Math.floor(i/2)][Math.floor(j/2)] ? " bg-black" : "")}></div>);
                }
            }
            else {
                if(j % 2 === 0) {
                    divs.push(<div key={21 * i + j} className={"rounded" + (grid.verticalWalls[Math.floor(i/2)][Math.floor(j/2)] ? " bg-black" : "")}></div>);
                }
                else {
                    divs.push(<div key={21 * i + j} className={(grid.squareBackground ? grid.squareBackground[Math.floor(i/2)][Math.floor(j/2)] : "")}></div>);
                }
            }
        }
    }
  
    return (
        <div className="grid grid-cols-[repeat(10,_3px_25px)_3px] grid-rows-[repeat(10,_3px_25px)_3px] w-fit">
            {divs}
        </div>
    );
}

export default WalledGrid;