import axios from 'axios';
import React from 'react';
import Select from 'react-select'
import {useState,useContext} from 'react';
import {authContext} from '../../Helper/authContext'

import './offer_a_deal.css'


const OfferAdeal=()=>{
        const [items, setitems] = useState([{ name: "", quantity : 0}])
        const [deal_name, setDealName] = useState("");
        const [deal_price, setDealPrice] = useState(0);
        
        let handleChange = (i, e) => {
            let newitems = [...items];
            newitems[i][e.target.name] = e.target.value;
            setitems(newitems);
          }
        
        let addFormFields = () => {
            setitems([...items, { name: "", quantity: 0 }])
          }
        
        let removeFormFields = (i) => {
            let newitems = [...items];
            newitems.splice(i, 1);
            setitems(newitems)
        }
        
        let handleSubmit = (event) => {
            event.preventDefault();
            const newObj={
              deal_name: deal_name,
              items: items,
              deal_price: deal_price
            }
            alert(JSON.stringify(newObj));
            
        }
        return (
            <form  onSubmit={handleSubmit}>
              <label>Deal Name </label>
              <input type = "Text" onChange={(event) => {
                setDealName(event.target.value)
              }}/>;
              {items.map((element, index) => (
                <div className="form-inline" key={index}>              
                  <label>Name</label>
                  <input type="text" name="name" value={element.name || ""} onChange={e => handleChange(index, e)} />
                  <label>Quantity</label>
                  <input type="text" name="quantity" value={element.quantity || ""} onChange={e => handleChange(index, e)} />
                  {
                    index ? 
                      <button type="button"  className="button remove" onClick={() => removeFormFields(index)}>Remove</button> 
                    : null
                  }
                </div>
              ))}
              <div className="button-section">
                  <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>
                  
              </div>
              <label>Price </label>
              <input type = "number" onChange={(event) => {
                setDealPrice(event.target.value)
              }}/>;
              <button className="button submit" type="submit">Submit</button>
          </form>
        );
            }
export default OfferAdeal;
