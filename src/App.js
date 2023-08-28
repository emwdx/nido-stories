
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import Spinner from 'react-bootstrap/Spinner';




const StoriesPage = () => {
const [titles, setTitles] = useState([]);
  const [story, setStory] = useState(''); // Add this line to hold the story content
  const [storyTitle,setTitle] = useState('')
  const [storyId,setStoryId] = useState('')
  const [showModal, setShowModal] = useState(false); // Add this line to control the modal
  const [user, setUser] = useState();
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');



  
  // Define the color palette
  const palette = [
    [14, 18, 28, 255],
    [149, 142, 125, 255],
    [40, 50, 74, 255],
    [254, 67, 0, 255],
    [237, 211, 131, 255]
  ];

  const openPrepopulatedForm = (email, storyId, tag) => {
    const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd97r-0CMegkt00e3LgT-jizdguw4AAR9mKipeEkSOeq7sCeg/viewform?usp=pp_url";
    const emailParam = `&entry.458050021=${encodeURIComponent(email)}`;
    const storyIdParam = `&entry.376668614=${encodeURIComponent(storyId)}`;
    const tagParam = `&entry.2075118817=${encodeURIComponent(tag)}`;
    const fullUrl = baseUrl + emailParam + storyIdParam + tagParam;
  
    window.open(fullUrl, '_blank'); // Open in a new tab
  };

  

  const onSignIn = (credentialResponse) => {

    console.log('Full credential object:', credentialResponse);
  
    const token = credentialResponse.credential
  
    // Decode the token using jwt-decode
    const decodedToken = jwtDecode(token);
  console.log(decodedToken)
    // Extract the email from the decoded token
    const email = decodedToken.email; // This might vary based on the exact structure of the token
  
    // Now you can use the email as needed in your application
    setUser(decodedToken);
  
    
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTKhyqis-rToLb2MA3_M0ngg4tiQUKMqy4NVMpbccMoPK-Q_hSytJRiXX-HTZ2leYKni15pSmU4yDZI/pubhtml?gid=0&single=true');
        const html = new DOMParser().parseFromString(response.data, 'text/html');
        const table = html.querySelector('table');
        const rows = Array.from(table.querySelectorAll('tr'));
    
        // Skip the header row and map over the rest to extract the titles
        const fetchedTitles = rows.slice(1).map(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          return { storyId: cells[0].innerText, title: cells[1].innerText, story: cells[2].innerText };
        });
    
        // Shuffle the fetched titles
        const shuffledTitles = shuffleArray(fetchedTitles);
    
        setTitles(shuffledTitles);
      } catch (error) {
        console.error('An error occurred while fetching the data:', error);
      }
    };
    
    fetchData();
    
  }, []);


  

// Add this function to handle opening the modal:
  const handleOpenModal = (storyContent,storyTitle,storyId) => {
    setStory(storyContent);
    setTitle(storyTitle);
    setStoryId(storyId);
    console.log(storyId)
    setShowModal(true);
  };

 
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap the elements
    }
    return array;
  };
  const handleTagSubmit = async () => {
    setShowSpinner(true); // Show the spinner


    if (user && user.email) {
      try {
        const response = await axios.post('https://worldlyfarflunglevel.emwdx.repl.co/submit_tag', {
          email: user.email,
          storyId: storyId,
          tag: tagInputValue
        });
        if (response.data.message === 'success') {
          console.log('Tag submitted successfully');
          setTagInputValue('');  // Reset input
          setConfirmationMessage('Tag submitted successfully'); // Set confirmation message
  
          // Optionally, you can clear the confirmation message after a delay:
          setTimeout(() => setConfirmationMessage(null), 1000); // Clear after 3 seconds
          setShowSpinner(false); // Hide the spinner once the submission is done
        } else {
          console.error('Tag submission failed');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };
  
  
  

  return (
    <>
    
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Changemakers: The Stories We Tell</a>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <div className="text-white">
                  {user ? `Logged in as ${user.email}` :
                    <GoogleLogin
                      onSuccess={credentialResponse => onSignIn(credentialResponse)}
                      onError={() => { console.log('Login Failed'); }}
                    />
                  }
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    
    <div className="container mt-4">
    <div className="jumbotron">
  <h1 className="display-4">Welcome to the Test Site for <u>The Stories We Tell</u></h1>
  <ul>
    <li>Log in using a Google Account</li>
    <li>Click on the stories to view them and add tags.</li>
  </ul>
</div>
      <div>
        {titles.map((item,index) => {
          // Determine the current color from the palette
          const color = palette[index % palette.length];

          // Convert the color to an rgba string
          const backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;

          return (
            <span 
              style={{ 
                textTransform: 'uppercase', 
                transition: 'opacity 0.25s 0.5s', 
                paddingInline: '0.1em',
                backgroundColor,
                color: 'white',
                fontSize: '2em',
                display: 'inline-block',
              }} 
              key={index}
            onClick={() => handleOpenModal(item.story,item.title,item.storyId)} // Add this line
 
            >
              {item.title}
            </span>
          );
        })}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{storyTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <div dangerouslySetInnerHTML={{ __html: story }} />
  <p>Add a tag to represent a theme, emotion, or personal value you associate with this story.</p>
  <p>If multiple tags apply, please enter each one separately.</p>
  {user && (
    <div>
      <input 
  type="text" 
  placeholder="Enter tag" 
  id="tagInput"
  value={tagInputValue}
  onChange={(e) => setTagInputValue(e.target.value)}
/>


<button onClick={handleTagSubmit} disabled={!tagInputValue}>Submit Tag</button>

      {confirmationMessage && <div className = "bg-success">{confirmationMessage}</div>} {/* Add this line */}
      {!confirmationMessage && showSpinner && <Spinner animation="border" />}

    </div>
  )}
</Modal.Body>

      </Modal>
    </div>

    </>
  );
};

export default StoriesPage;