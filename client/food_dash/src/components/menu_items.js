import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './menu_items.css'

function Menu() {
  const location = useLocation();
  const [menuData, setMenuData] = useState([]);
  const [cartData,setCartData]=useState([]);
  const [totalBill,setTotalBill]=useState([]);
  const [billFlag,setBillFlag]=useState(false);

  useEffect(() => {
    console.log(location.state.restaurant_id);
    const newObj = {
      id: location.state.restaurant_id,
    };
    axios
      .post("https://group-26-backend.herokuapp.com/rest_main/get_menu_items", newObj, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setMenuData(response.data.data);
        }
      });
  }, []);
  //console.log(location.state);

  const addCart=(item_id)=>{
    var temp_list=(cartData=>[...cartData,item_id])
    setCartData(temp_list)
    const newObj = {
      item_id: item_id,
    };
    axios
    .post("https://group-26-backend.herokuapp.com/shopping/getBill",newObj, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        setTotalBill(totalBill=>[...totalBill,response.data.data])
      }
    });    
  }

  const removeCart=(item_id)=>{
    var ind = cartData.indexOf(item_id)
    if(ind > -1){

      var temp_list = cartData.splice(ind,1)
      setCartData(temp_list)
    }
    if(cartData.length == 1){
      console.log("Yes")
      let x= cartData[0]
      if(x==item_id){
        setCartData([])
      }
    }
    const newObj = {
      item_id: item_id,
    };
    axios
    .post("https://group-26-backend.herokuapp.com/shopping/getBill",newObj, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        var ind2=totalBill.indexOf(response.data.data)
        if(ind2 > -1){
          var temp_list = totalBill.splice(ind2,1)
          setTotalBill(temp_list)
        }
        if(totalBill.length == 1){
          setTotalBill([])
        }
      }
    });
  }

  
  const billCalc=()=>{
    let total=0
    Object.entries(totalBill).forEach(([key, value]) => {
      total=total+value
    })
    return total
  }


  const sendOrder=()=>{

      const tempObj={
        restaurant_id:location.state.restaurant_id,
        totalBill:billCalc(totalBill),
        status:"Pending"
      }
      axios
     .post("https://group-26-backend.herokuapp.com/shopping/setOrder",tempObj, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response)=>{
      if(response.data.error){
        console.log(response.data.error)
      }else{
        
        let x =response.data.order_id
        alert("Order placed! Order id is "+x+". Please note this down!")
      }
    })
    // cartData.forEach(item_id =>{
    //   const newObj={
    //     item_id:item_id,
    //     restaurant_id:location.state.restaurant_id,
    //     total_bill:totalBill,
    //   }
    //   axios
    //  .post("https://group-26-backend.herokuapp.com/shopping/getBill",newObj, {
    //   headers: {
    //     "Content-Type": "application/json; charset=UTF-8",
    //     accessToken: localStorage.getItem("accessToken"),
    //   },
    // })
    //   .then((response) => {
    //     if (response.data.error) {
    //       alert(response.data.error);
    //     } else {
    //       var ind2=totalBill.indexOf(response.data.data)
    //       if(ind2 > -1){
    //         var temp_list = totalBill.splice(ind2,1)
    //         setTotalBill(temp_list)
    //       }
    //     }
    //   });
    // })
  }

  return (
    <div>
      {menuData &&
        menuData.map((d) => {
          return (
            <div key={d}>
              <b>
                {d.item_name}, {d.item_id}, {d.category}
                <br></br>
                <div class="button">
                  <button onClick={()=>addCart(d.item_id)}>Add</button>
                  <button onClick={()=>removeCart(d.item_id)}>Delete</button>
                </div>
              </b>
            </div>
          );
        })}
        {cartData.length ?(<h2>Shopping Cart</h2>):(<div></div>)}
        {cartData &&
        cartData.map((in_cart_id) => {
          return(
              <div key={in_cart_id}>
                <br></br>
                {menuData.map((d)=>{
                  let x = in_cart_id==d
                  return(
                    <div key={in_cart_id}>
                      {!x ? (
                        <div>{d.item_name}</div>
                      ) : (
                        <div>
                          
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
          )
        })}
        {totalBill.length ? 
        (<div>Your total Bill is: {billCalc(totalBill)}$ <br></br><button class="button" onClick={sendOrder}>Place Order!</button></div>
        
        
        ):(<div></div>)}

    </div>
  );
}

export default Menu;

// export default class Menu extends React.Component {
//   //   constructor(props) {
//   //     super(props);
//   //     this.setState(this.props.location.state);
//   //   }

//   alertMessage() {
//     console.log(this.state);
//   }

//   render() {
//     // const { state } = this.props.location;
//     return (
//       <button
//         onClick={() => {
//           this.alertMessage();
//         }}
//       >
//         click me to see log
//       </button>
//     );
//   }
//}
