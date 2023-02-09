(function(){
    let isPause = false;
    let animationId = null;
    const speed = 4;
    const road = document.querySelector('.road');
    const roadHeight = road.clientHeight;
    const roadWidth = road.clientWidth / 2;

    const car = document.querySelector('.car');
    const carWidth = car.clientWidth / 2;
    const carHeight = car.clientHeight;
    const carCoords = getCoords(car);//координаты машины
    const carMove = {
        top: null,
        down: null,
        right: null,
        left: null,
    };

    const arrow = document.querySelector('.arrow');
    const arrowWidth = arrow.clientWidth / 2;
    let arrowCoords = getCoords(arrow);

    const danger = document.querySelector('.danger');
    const dangerWidth = danger.clientWidth / 2;
    let dangerCoords = getCoords(danger);

    const coin = document.querySelector('.coin');
    const coinWidth = coin.clientWidth / 2;
    const coinHeight = coin.clientHeight;
    let coinCoords = getCoords(coin);

    const treeCoords = [];
    const trees = document.querySelectorAll('.tree');
        trees.forEach((item)=>{
        const tree = item;
        const coordsTrees = getCoords(tree);
        treeCoords.push(coordsTrees);
    });

// получение координат 
    function getCoords(element){
        let numericY =  parseFloat(window.getComputedStyle(element)
                .transform.split(',').slice(-1));
        let numericX = parseFloat(window.getComputedStyle(element)
                .transform.split(',').slice(-2));
        
        return {x: numericX, y: numericY};
    }

    // Отрисовка деревьев пол координат 
    function treesAnimation(){
        trees.forEach((item)=>{
            const tree = item;
            const coordsTrees = getCoords(tree);
            let newCoordY = coordsTrees.y + speed;

            if (newCoordY > window.innerHeight){
                newCoordY = -370;
            }
            coordsTrees.y = newCoordY;

            tree.style.transform = `translate(${coordsTrees.x}px, ${newCoordY}px)`;
        });
    }


    function elementAnimation(el, elCoort, elWidth){
        let newYcoord = elCoort.y + speed;
        let newXcoord = elCoort.x;

        if (newYcoord > window.innerHeight){
            newYcoord = -1350;

            const direction = Math.floor(Math.random() * 2);
            const maxXcoord = (roadWidth + 1 - elWidth);
            const randomXcoord = Math.floor(Math.random() * maxXcoord);

            newXcoord = direction === 0 ? -randomXcoord : randomXcoord;
        }
        

        elCoort.x = newXcoord;
        elCoort.y = newYcoord;
        el.style.transform = `translate(${elCoort.x}px, ${elCoort.y}px)`;
    }

    animationId = requestAnimationFrame(startGame);
    function startGame(){
        treesAnimation();
        elementAnimation(arrow, arrowCoords, arrowWidth);
        elementAnimation(danger, dangerCoords, dangerWidth);
        elementAnimation(coin, coinCoords, coinWidth);
        animationId = requestAnimationFrame(startGame);
    }


    const btnGame = document.querySelector('.btn-game');
    btnGame.addEventListener('click', ()=>{
        isPause = !isPause;
        if (isPause){
            cancelAnimationFrame(animationId)
            btnGame.children[0].style.display = 'none';
            btnGame.children[1].style.display = 'initial';
        }else {
            requestAnimationFrame(startGame);
            btnGame.children[0].style.display = 'initial';
            btnGame.children[1].style.display = 'none';
        }
    });

    window.addEventListener('keydown', (e)=>{
        if (!isPause){
            if (e.code === 'ArrowUp') {
                carMove.top = requestAnimationFrame(CarMoveTop);
            } else if (e.code === 'ArrowLeft'){
                carMove.left = requestAnimationFrame(CarMoveLeft);
            } else if (e.code === 'ArrowRight'){
                carMove.right = requestAnimationFrame(CarMoveRight);
            } else if (e.code === 'ArrowDown'){
                carMove.down = requestAnimationFrame(CarMoveBottom);
            }
        }
    });

    window.addEventListener('keyup', (e)=>{
        if (e.code === 'ArrowUp') {
            carMove.top = cancelAnimationFrame(CarMoveTop);
        } else if (e.code === 'ArrowLeft'){
            carMove.left = cancelAnimationFrame(CarMoveLeft);
        } else if (e.code === 'ArrowRight'){
            carMove.right = cancelAnimationFrame(CarMoveRight);
        } else if (e.code === 'ArrowDown'){
            carMove.down = cancelAnimationFrame(CarMoveBottom);
        }
    });

    function CarMoveTop(){
        let newY = carCoords.y - 20;
        if (newY < 0){
            return;
        }
        carCoords.y = newY;
        coordinateCar(carCoords.x, newY);
    }
    function CarMoveBottom(){
        let newY = carCoords.y + 20;
        if (newY > roadHeight - carHeight){
            return;
        }
        carCoords.y = newY;
        coordinateCar(carCoords.x, newY);
    }
    function CarMoveLeft(){
        let newX = carCoords.x - 20;
        if (newX - carWidth < -roadWidth){
            return;
        }

        carCoords.x = newX;
        coordinateCar(newX, carCoords.y);
    }
    function CarMoveRight(){
        let newX = carCoords.x + 20;
        if (newX + carWidth> roadWidth){
            return;
        }
        carCoords.x = newX;
        coordinateCar(newX, carCoords.y);
    }

    function hasCollision(){
        const carYtop = carCoords.y;
        const carYbottom = carCoords.y + carHeight;

        const carXleft  = carCoords.x - carWidth;
        const carXright = carCoords.x;

        const coinYtop = coinCoords.y;
        const coinYbottom = coinCoords.y + coinHeight;

        const coinXleft = coinCoords.x - coinWidth;
        const coinXright = coinCoords.x;

        if (carYtop > coinYbottom || carYbottom < coinYtop){
            return false;
        }

        if (carXleft > coinXright || carXright < coinXleft){
            return false;
        }

        return  true;
    }

// координаты машины
    function coordinateCar(x,y){
        console.log(hasCollision())
        car.style.transform = `translate(${x}px, ${y}px)`;
    }
})();