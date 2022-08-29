function WalledGrid({ wallMeetingPoints, horizontalWalls, verticalWalls, squares }) {
    let divs = [];
    for(let i = 0; i < 21; i++) {
        for(let j = 0; j < 21; j++) {
            if(i % 2 === 0) {
                if(j % 2 === 0) {
                    divs.push(<div key={21 * i + j} className={wallMeetingPoints[Math.floor(i/2)][Math.floor(j/2)]}></div>);
                }
                else {
                    divs.push(<div key={21 * i + j} className={horizontalWalls[Math.floor(i/2)][Math.floor(j/2)]}></div>);
                }
            }
            else {
                if(j % 2 === 0) {
                    divs.push(<div key={21 * i + j} className={verticalWalls[Math.floor(i/2)][Math.floor(j/2)]}></div>);
                }
                else {
                    divs.push(<div key={21 * i + j} className={squares[Math.floor(i/2)][Math.floor(j/2)]}></div>);
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