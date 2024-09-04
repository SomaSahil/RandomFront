import {useState,useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // let y = Math.floor(Math.random() * 100);
  const [num,setNum] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false); // Track fetching status

  const fetchData = async () => {
    setFetching(true); // Set fetching status to true
    try {
      const response = await axios.get(`http://localhost:5000/getData`);

      const fetchedData = response.data.data;

      // Reverse the fetched data
      const reversedData = fetchedData.reverse();
      setData(reversedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setFetching(false); // Reset fetching status
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // generate custom time stamp because I dont like the default one :P
  const getFormattedTimestamp = () => {
    const now = new Date();
  
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('default', { month: 'short' });
    const year = now.getFullYear();
  
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };


  const randomnum = async ()=>{
    let n = document.getElementById('limitNum').value;
    let x;

    if(n!=''){
    n = parseInt(n);
    x = Math.floor(Math.random() * n+1);

    }else{
    x = Math.floor(Math.random() * 100);
    }
    x=parseInt(x);
    setNum(x)

    console.log('value of num: ',num)


    const data = {
      number: (num),
      // createdon: new Date().toISOString()
      createdon: getFormattedTimestamp() // Using the formatted timestamp
    };

    console.log('data being sent: ',data)

    try {
      const response = await axios.post('http://localhost:5000/addData', data);
      console.log('Data inserted successfully:', response.data);

       // Refresh the data after adding new entry
       const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/getData`);
          
      const fetchedData = response.data.data;
      // Reverse the fetched data
      const reversedData = fetchedData.reverse();

          setData(reversedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
      
    } catch (error) {
      console.error('Error inserting data:', error);
    }

  };

  function resetLimitNum(){
    document.getElementById('limitNum').value='';
  }

  

  document.title = "Random Number MERN App by Sahil Soma";

  return (
    <div className="app">
      <h1>A Full Stack Random Number Generator App</h1>
      <p>(developed using MERN Stack)</p>
      <h2>{num}</h2>

      <p>Enter Upper Range: <input type='text' placeholder='Enter a number' id='limitNum'></input></p>

      <p>Enter DB Reset Pass: <input type='text' placeholder='Enter Password to Reset DB' id='limitNum'></input></p>
      <button onClick={randomnum}>Generate</button>
      <button onClick={resetLimitNum}>Reset Range</button>
      <button>Reset DB <small>(WIP)</small></button>

      <p><small>Note 1: It can only generate random numbers between 0 and 99, unless you set a upper limit.</small> <br></br>
      <small>Note 2: WIP = Work in progress</small>
      </p>

      <hr></hr>
      <div id='data'>
        

        {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Previously Generated random numbers:</h3>
          {/* table to show fetched data */}
          <table>
            <tr>
              <td>S No.</td>
              <td>Random Number</td>
              <td>Timestamp</td>
            </tr>
          
            {data.map((item) => (
              
                <tr key={item.serial}>
                  <td>{item.serial}</td>
                  <td>{item.number}</td>
                  <td>{item.createdon}</td>
                </tr>
                
            ))}
            </table>
          
        </div>
      )}

      </div>
      <footer>Copyright 2024 &copy; Sahil Soma <br></br> Developed with <span id='footheart'>&hearts;</span> in Jammu, India <br></br><small>Generously hosted by Netlify (frontend), Render (backend), and MongoDB Atlas (cloud database).</small></footer>
    </div>
  );
}

export default App;
