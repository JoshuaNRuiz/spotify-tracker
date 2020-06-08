import React, {useState} from 'react';
import Controls from '../../component/Controls/Controls';
import Tracklist from '../../component/Tracklist/Tracklist';
import './Tracker.css'

const Tracker = (props) => {

    const accessToken = props.accessToken;

    const LIMIT_DEFAULT = 10;
    const MIN_LIMIT = 1;
    const MAX_LIMIT = 50;
    const RANGE_DEFAULT = 'long_term';

    const [isLoaded, setIsLoaded] = useState(false);
    const [limit, setLimit] = useState(LIMIT_DEFAULT);
    const [timeRange, setTimeRange] = useState(RANGE_DEFAULT);
    const [items, setItems] = useState([]);

    const handleTimeRangeChange = (e) => {
        setTimeRange(e.target.value);
    }

    const handleLimitChange = (e) => {
        setLimit(e.target.value);
    }

    const handleRefresh = () => {
        let url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}&offset=0`
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Did not get a response from the server.")
            }
            return response.json();
        })
        .then(data => {
            setIsLoaded(true);
            setItems(data.items)
        })
        .catch(error => {
            console.log(error);
        })
    }

    let tracklist = isLoaded ? <Tracklist items={items}/> : null

    return (
        <div className='tracker'>
            <Controls 
                min={MIN_LIMIT} 
                max={MAX_LIMIT} 
                limit={limit} 
                handleTimeRangeChange={handleTimeRangeChange}
                handleLimitChange={handleLimitChange}
                handleRefresh={handleRefresh}/>
            {tracklist}
        </div>
    )
}

export default Tracker;