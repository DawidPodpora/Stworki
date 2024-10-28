import TestButton2 from './ContentComponents/TestButton2.js';
import TestButton3 from './ContentComponents/TestButton3.js';
import StartPage from './ContentComponents/StartPage.js';
function Content({selectedButton}) {

  let ComponentToRender;
  switch(selectedButton)
  {
    case 1:
      ComponentToRender = StartPage;
      console.log(selectedButton);
      break;
    case 2:
      ComponentToRender = TestButton2;
      break;
    case 3:
      ComponentToRender = TestButton3;
      break;
  }

    return (
      
        
      <div className="absolute w-4/5 bg-black1 h-screen right-0 ">
        <ComponentToRender/>
      </div>
      
    );
  }
  
  export default Content;