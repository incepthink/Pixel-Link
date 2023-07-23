import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { StoreContext } from '../../utils/Store';

const CSVDownloader = ({ api }) => {
  const { state, dispatch } = useContext(StoreContext);
  const [data, setData] = useState([])
  const jwt = state.jwt;

  const fetchData = async () => {
    try {
      const res = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setData(res.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])
  

  return (
    <CSVLink className="px-8 py-3 w-fit place-self-end bg-custom-blue rounded-lg" data={data}>
      Download
    </CSVLink>
  )
}

export default CSVDownloader