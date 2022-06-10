import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";

const Header = <h1>Header</h1>;
const Welcome = <p>Welcome</p>;
const Nav = <div>Nav</div>;
const Footer = <div>Foot</div>;
const Home = <div>Home</div>;
const Content = <p>Content</p>;
const ref = "ref";

export default function App() { return (
	<div className="app">
		<BrowserRouter>
			<Routes>
				<Route path="/welcome" element={<Welcome />} />
				<Route path="*" element={
					<>
						<Header />
						<Routes>
							<Route path="/catalog/*" element={
								<div className="two-column" ref={ref}>
									<Nav />
									<div className="content">
										<Routes>
											<Route path=":id" element={<Content />} />
											<Route index element={<p>Use the left nav to selet a catalog item</p>} />
										</Routes>
									</div>
								</div>
							} />
							<Route index element={<Home />} />
						</Routes>
						<Footer />
					</>
				} />
			</Routes>
		</BrowserRouter>
	</div>
); };
