import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import Blog from "../components/dashboard/Blog";

import bg1 from "../assets/images/bg/bg1.jpg";

const BlogData = [
  {
    image: bg1,
    title: "Xazar Ter-Khachatryan",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  }
];


const Account = () => {
  return (
    <Row>
      <Col md="6" lg="4">
          <Card body>
            <Blog
              image={BlogData[0].image}
              title={BlogData[0].title}
              subtitle={BlogData[0].subtitle}
              text={BlogData[0].description}
              color={BlogData[0].btnbg}
            />
          </Card>
        </Col>
      <Col>
        {/* --------------------------------------------------------------------------------*/}
        {/* Card-1*/}
        {/* --------------------------------------------------------------------------------*/}
        

        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-bell me-2"> </i>
            My account
          </CardTitle>
          <Row>
        {/* <h5 className="mb-3 mt-3">Alignment Text</h5> */}
        
      
      </Row>
          <CardBody className="p-4">
            <Row justify-content>
              <Col lg="8">
                <h2 className="mt-4">Xtreme React Admin Pro Version</h2>
                <h5 className=" mb-4">
                  5 premium and highly customizable demo variations included in
                  the package, with React Router 6, Redux Toolkit, Axios nd much
                  more...
                </h5>
                <img
                  src="https://www.wrappixel.com/wp-content/uploads/edd/2020/04/xtreme-react-admin-template-y.jpg"
                  alt="my"
                />
                <Button
                  className="mt-3"
                  color="primary"
                  href="https://www.wrappixel.com/templates/xtreme-react-redux-admin/?ref=33"
                  target="_blank"
                >
                  Check Pro Version
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Account;
