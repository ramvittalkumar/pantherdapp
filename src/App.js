import React, { useEffect, useState, useRef } from "react";
import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { pickLotteryWinner } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

//Adding Minting constants
const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;


function App() {
	//Mint Dapp code starts
	const dispatch = useDispatch();
	const blockchain = useSelector((state) => state.blockchain);
	const data = useSelector((state) => state.data);
	const [claimingNft, setClaimingNft] = useState(false);
	const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
	const [mintAmount, setMintAmount] = useState(1);
	const [CONFIG, SET_CONFIG] = useState({
	  CONTRACT_ADDRESS: "",
	  SCAN_LINK: "",
	  NETWORK: {
		NAME: "",
		SYMBOL: "",
		ID: 0,
	  },
	  NFT_NAME: "",
	  SYMBOL: "",
	  MAX_SUPPLY: 1,
	  WEI_COST: 0,
	  DISPLAY_COST: 0,
	  GAS_LIMIT: 0,
	  MARKETPLACE: "",
	  MARKETPLACE_LINK: "",
	  SHOW_BACKGROUND: false,
	});
  
	const claimNFTs = () => {
	  let cost = CONFIG.WEI_COST;
	  let gasLimit = CONFIG.GAS_LIMIT;
	  let totalCostWei = String(cost * mintAmount);
	  let totalGasLimit = String(gasLimit * mintAmount);
	  console.log("Cost: ", totalCostWei);
	  console.log("Gas limit: ", totalGasLimit);
	  setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
	  setClaimingNft(true);
	  blockchain.smartContract.methods
		.mint(mintAmount)
		.send({
		  gasLimit: String(totalGasLimit),
		  to: CONFIG.CONTRACT_ADDRESS,
		  from: blockchain.account,
		  value: totalCostWei,
		})
		.once("error", (err) => {
		  console.log(err);
		  setFeedback("Sorry, something went wrong please try again later.");
		  setClaimingNft(false);
		})
		.then((receipt) => {
		  console.log(receipt);
		  setFeedback(
			`WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io ${CONFIG.MARKETPLACE_LINK} to view it.`
		  );
		  setClaimingNft(false);
		  dispatch(fetchData(blockchain.account));
		});
	};
  
	const decrementMintAmount = () => {
	  let newMintAmount = mintAmount - 1;
	  if (newMintAmount < 1) {
		newMintAmount = 1;
	  }
	  setMintAmount(newMintAmount);
	};
  
	const incrementMintAmount = () => {
	  let newMintAmount = mintAmount + 1;
	  if (newMintAmount > 10) {
		newMintAmount = 10;
	  }
	  setMintAmount(newMintAmount);
	};
  
	const getData = () => {
	  if (blockchain.account !== "" && blockchain.smartContract !== null) {
		dispatch(fetchData(blockchain.account));
	  }
	};
  
	const getConfig = async () => {
	  const configResponse = await fetch("/config/config.json", {
		headers: {
		  "Content-Type": "application/json",
		  Accept: "application/json",
		},
	  });
	  const config = await configResponse.json();
	  SET_CONFIG(config);
	};
  
	useEffect(() => {
	  getConfig();
	}, []);
  
	useEffect(() => {
	  getData();
	}, [blockchain.account]);
  

	//Mint Dapp code ends
    return (
      <div classNameName="App">
	<header id="home">
		<div className="bg-img" style={{backgroundImage: "url('/config/images/p1.jpg')"}}>
			
		</div>
		<nav id="nav" className="navbar nav-transparent">
			<div className="container">
				<div className="navbar-header">
					<div className="navbar-brand">
						<a href="index.html">
							<img className="logo" src="/config/images/logo.png" alt="logo" />
							<img className="logo-alt" src="/config/images/logo.png" alt="logo" />
						</a>
					</div>

					<div className="nav-collapse">
						<span></span>
					</div>
				</div>

				<ul className="main-nav nav navbar-nav navbar-right">
					<li><a href="#home">Home</a></li>
					<li><a href="#about">About</a></li>
					<li><a href="#portfolio">Portfolio</a></li>
					<li><a href="#minting">Minting</a></li>
					<li><a href="#team">Team</a></li>
					<li><a href="#contact">Lottery</a></li>
				</ul>

			</div>
		</nav>
		<div className="home-wrapper">
			<div className="container">
				<div className="row">

					<div className="col-md-10 col-md-offset-1">
						<div className="home-content">
							<h1 className="white-text">Save Panthers</h1>
							<p className="white-text">We're protecting black panthers an extremely endangered animal and you can help.
							</p>
							<button className="white-btn"><a href="#about">Get Started!</a></button>
							
						</div>
					</div>

				</div>
			</div>
		</div>

	</header>

	<div id="about" className="section md-padding" style={{backgroundImage: "url('/config/images/p2.jpg')"}}>

		<div className="container">

			<div className="row">

				<div className="section-header text-center">
				<h2 className="title">Welcome to SavePanthers</h2>
				</div>
				<div className="col-md-4">
					<div className="about">
						<i className="fa fa-magic"></i>
						<h3>Inspiration</h3>
						<p>Panthers are listed as an Endangered Species under the Endangered Species Act. 
							Their protection and preservation is of utmost importance. So, we decided to mint 
							exclusive NFT collectibles for raising fund to this cause.</p>
					</div>
				</div>
				<div className="col-md-4">
					<div className="about">
						<i className="fa fa-money"></i>
						<h3>For A Cause</h3>
						<p>We mint exclusive Panther NFT collectibles for raising fund</p>
					</div>
				</div>

				<div className="col-md-4">
					<div className="about">
						<i className="fa fa-star"></i>
						<h3>Lottery</h3>
						<p>We pick lottery winners for getting Panther NFT using chainlink VRF</p>
					</div>
				</div>

			</div>

		</div>

	</div>


	<div id="portfolio" className="section md-padding bg-grey" style={{backgroundImage: "url('/config/images/flat.jpg')"}}>

		<div className="container">

			<div className="row">

				<div className="section-header text-center">
					<h2 className="title">Featured Panthers</h2>
				</div>

				<div className="col-md-4 col-xs-6 work">
					<img className="img-responsive" src="/config/images/panther-img/64.png" alt="" />
					<div className="overlay"></div>
					<div className="work-content">
						<span>Panther NFT Collection #64</span>
						<h3>Collectibles to create awareness on black panther conservation</h3>
						<div className="work-link">
							<a className="lightbox" target="_blank" rel="noopener noreferrer" href="/config/images/panther-img/64.png"><i className="fa fa-search"></i></a>
						</div>
					</div>
				</div>

				<div className="col-md-4 col-xs-6 work">
					<img className="img-responsive" src="/config/images/panther-img/67.png" alt="" />
					<div className="overlay"></div>
					<div className="work-content">
						<span>Panther NFT Collection #67</span>
						<h3>Collectibles to create awareness on black panther conservation</h3>
						<div className="work-link">
							<a className="lightbox" target="_blank" rel="noopener noreferrer" href="/config/images/panther-img/67.png"><i className="fa fa-search"></i></a>
						</div>
					</div>
				</div>

				<div className="col-md-4 col-xs-6 work">
					<img className="img-responsive" src="/config/images/panther-img/69.png" alt="" />
					<div className="overlay"></div>
					<div className="work-content">
						<span>Panther NFT Collection #69</span>
						<h3>Collectibles to create awareness on black panther conservation</h3>
						<div className="work-link">
							<a className="lightbox" target="_blank" rel="noopener noreferrer" href="/config/images/panther-img/69.png"><i className="fa fa-search"></i></a>
						</div>
					</div>
				</div>

				<div className="col-md-4 col-xs-6 work">
					<img className="img-responsive" src="/config/images/panther-img/71.png" alt="" />
					<div className="overlay"></div>
					<div className="work-content">
						<span>Panther NFT Collection #71</span>
						<h3>Collectibles to create awareness on black panther conservation</h3>
						<div className="work-link">
							<a className="lightbox" target="_blank" rel="noopener noreferrer" href="/config/images/panther-img/71.png"><i className="fa fa-search"></i></a>
						</div>
					</div>
				</div>
				<div className="col-md-4 col-xs-6 work">
					<img className="img-responsive" src="/config/images/panther-img/77.png" alt="" />
					<div className="overlay"></div>
					<div className="work-content">
						<span>Panther NFT Collection #77</span>
						<h3>Collectibles to create awareness on black panther conservation</h3>
						<div className="work-link">
							<a className="lightbox" target="_blank" rel="noopener noreferrer" href="/config/images/panther-img/77.png"><i className="fa fa-search"></i></a>
						</div>
					</div>
				</div>

				<div className="col-md-4 col-xs-6 work">
					<img className="img-responsive" src="/config/images/panther-img/87.png" alt="" />
					<div className="overlay"></div>
					<div className="work-content">
						<span>Panther NFT Collection #87</span>
						<h3>Collectibles to create awareness on black panther conservation</h3>
						<div className="work-link">
							<a className="lightbox" target="_blank" rel="noopener noreferrer" href="/config/images/panther-img/87.png"><i className="fa fa-search"></i></a>
						</div>
					</div>
				</div>

			</div>

		</div>

	</div>


	
		
		

	<div id="minting" className="section md-padding">

		<div className="container">
		<s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "#004d11",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed #ebbd05ee",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "#ffffff",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "#ebbd05ee",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "#ffffff" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "#ffffff" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "#ffffff" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "#ffffff" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "#ffffff",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "#ffffff",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "#ffffff",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "#ffffff",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} testnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
		</div>

	</div>


	<div id="testimonial" className="section md-padding">

		<div className="bg-img" style={{backgroundImage: "url('./img/background3.jpg')"}}>
			<div className="overlay"></div>
		</div>

		<div className="container">

			<div className="row">

				<div className="col-md-10 col-md-offset-1">
					<div id="testimonial-slider" className="owl-carousel owl-theme">

						<div className="testimonial">
							<div className="testimonial-meta">
								<img src="./img/perso1.jpg" alt="" />
								<h3 className="white-text">John Doe</h3>
								<span>Web Designer</span>
							</div>
							<p className="white-text">Molestie at elementum eu facilisis sed odio. Scelerisque in dictum non consectetur a erat. Aliquam id diam maecenas ultricies mi eget mauris.</p>
						</div>

						<div className="testimonial">
							<div className="testimonial-meta">
								<img src="./img/perso2.jpg" alt="" />
								<h3 className="white-text">John Doe</h3>
								<span>Web Designer</span>
							</div>
							<p className="white-text">Molestie at elementum eu facilisis sed odio. Scelerisque in dictum non consectetur a erat. Aliquam id diam maecenas ultricies mi eget mauris.</p>
						</div>

					</div>
				</div>

			</div>

		</div>

	</div>

	<div id="team" className="section md-padding" style={{backgroundImage: "url('/config/images/p2.jpg')"}}>

		<div className="container"> 

			<div className="row">

				<div className="section-header text-center">
					<h2 className="title">Our Team</h2>
				</div>

				<div className="col-sm-4">
					<div className="team">
						<div className="team-img">
							<img className="img-responsive" src="/config/images/team/ProfilePic-RamVittal.jpg" alt="" />
							<div className="overlay">
								<div className="team-social">
								<a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/ram-vittal-kumar-k-83018358"><i className="fa fa-linkedin"></i></a>
									<a target="_blank" rel="noopener noreferrer" href="https://github.com/ramvittalkumar"><i className="fa fa-github"></i></a>
								</div>
							</div>
						</div>
						<div className="team-content">
							<h3>Ram Vittal</h3>
							<span>Technical Architect</span>
						</div>
					</div>
				</div>

				<div className="col-sm-4">
					<div className="team">
						<div className="team-img">
							<img className="img-responsive" src="/config/images/team/ProfilePic-KaushikMurali.jpg" alt="" />
							<div className="overlay">
								<div className="team-social">
									<a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/kaushik-murali-06625859/"><i className="fa fa-linkedin"></i></a>
									<a target="_blank" rel="noopener noreferrer" href="https://github.com/kaushikmrl"><i className="fa fa-github"></i></a>
								</div>
							</div>
						</div>
						<div className="team-content">
							<h3>Kaushik Murali</h3>
							<span>Product Designer</span>
						</div>
					</div>
				</div>

				<div className="col-sm-4">
					<div className="team">
						<div className="team-img">
							<img className="img-responsive" src="/config/images/team/ProfilePic-SajithMohideen.jpg" alt="" />
							<div className="overlay">
								<div className="team-social">
								<a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/sajith-mohideen-695628b8"><i className="fa fa-linkedin"></i></a>
									<a target="_blank" rel="noopener noreferrer" href="https://github.com/SajithMohideen"><i className="fa fa-github"></i></a>
								</div>
							</div>
						</div>
						<div className="team-content">
							<h3>Sajith Mohideen</h3>
							<span>Sr. Developer</span>
						</div>
					</div>
				</div>

			</div>

		</div>

	</div>

	<div id="contact" className="section md-padding">

		<div className="container">

			<div className="row">
				<div className="section-header text-center">
					<h2 className="title">Exclusive Mega Lottery</h2>
					<span>Power up your chance to win exclusive Panther NFTs. Will you be our next lucky winner?</span>
				</div>
				
				<div className="col-md-8 col-md-offset-2">
					<form className="contact-form">
					<StyledButton
						style={{
								textAlign: "center",
								color: "#FFF",
								backgroundColor: "#6195FF"
							}}
						onClick={(e) => {
							e.preventDefault();
							dispatch(pickLotteryWinner());
						}}
						>
						Play Now!
						</StyledButton>
					</form>
				</div>

			</div>

		</div>

	</div>

	


	<footer id="footer" className="sm-padding bg-dark">

		<div className="container">

			<div className="row">

				<div className="col-md-12"> 

					<div class="bg-primary-darker p-5 text-center w-full text-white">
						<a target="_blank" href="https://polygon.technology" rel="noreferrer">
							<span class="text-md block flex items-center justify-center"> <img src="/config/images/polygon.da7b877d.svg" className="polylogo" alt=""/> Powered by Polygon</span>
						</a><br/>
						<span class="text-xs">SavePanther Initiative</span>
					</div>

					{/*<div className="footer-logo">
						<a href="index.html"><img src="/config/images/logo-alt.png" alt="logo" /></a>
					</div>*/}
					<div className="footer-copyright">
						<p>ETHGlobal Hackathon 2022</p>
					</div>

				</div>

			</div>

		</div>

	</footer>

	<div id="back-to-top"></div>

	<div id="preloader">
		<div className="preloader">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
      </div>
    );
   
}

export default App;
