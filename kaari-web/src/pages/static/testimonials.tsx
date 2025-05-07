import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

// Additional styles for the testimonials page
const TestimonialsPageStyles = styled(StaticPageWrapper)`
  .testimonials-container {
    margin-top: 40px;
  }
  
  .testimonial-filters {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
    flex-wrap: wrap;
    
    .filter-button {
      background-color: white;
      border: 1px solid ${Theme.colors.gray3};
      color: ${Theme.colors.gray2};
      font: ${Theme.typography.fonts.largeM};
      padding: 10px 20px;
      margin: 0 10px 10px;
      border-radius: ${Theme.borders.radius.full};
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: ${Theme.colors.primary};
        color: ${Theme.colors.primary};
      }
      
      &.active {
        background-color: ${Theme.colors.primary};
        border-color: ${Theme.colors.primary};
        color: white;
      }
    }
  }
  
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .testimonial-card {
    background-color: white;
    border-radius: ${Theme.borders.radius.md};
    padding: 30px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    }
    
    .quote-icon {
      color: ${Theme.colors.tertiary}50;
      font-size: 30px;
      margin-bottom: 20px;
    }
    
    .testimonial-content {
      flex-grow: 1;
      
      p {
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
        font-style: italic;
        line-height: 1.6;
        margin-bottom: 20px;
      }
    }
    
    .stars {
      display: flex;
      margin-bottom: 15px;
      
      svg {
        color: #FFD700;
        margin-right: 5px;
      }
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      
      .author-image {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 15px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .author-details {
        h4 {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin-bottom: 5px;
        }
        
        p {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.gray2};
          margin: 0;
        }
      }
    }
  }
  
  .video-testimonials {
    margin: 60px 0;
    
    .videos-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-top: 30px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .video-card {
      border-radius: ${Theme.borders.radius.md};
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      
      .video-thumbnail {
        position: relative;
        width: 100%;
        padding-top: 56.25%; /* 16:9 Aspect Ratio */
        background-color: #f0f0f0;
        cursor: pointer;
        
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70px;
          height: 70px;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
          
          &:after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-top: 15px solid transparent;
            border-left: 25px solid white;
            border-bottom: 15px solid transparent;
            margin-left: 5px;
          }
          
          &:hover {
            background-color: rgba(0, 0, 0, 0.9);
          }
        }
      }
      
      .video-info {
        padding: 20px;
        
        h4 {
          font: ${Theme.typography.fonts.h4};
          color: ${Theme.colors.black};
          margin-bottom: 10px;
        }
        
        p {
          font: ${Theme.typography.fonts.text16};
          color: ${Theme.colors.gray2};
          margin-bottom: 0;
        }
      }
    }
  }
`;

const testimonials = [
  {
    id: 1,
    content: "Finding an apartment in Lagos used to be a nightmare until I discovered Kaari. The verification process gave me peace of mind, and I found my dream apartment within a week!",
    rating: 5,
    author: "Chioma Okonkwo",
    location: "Lagos, Nigeria",
    image: "https://via.placeholder.com/50",
    tag: "tenant"
  },
  {
    id: 2,
    content: "As a property owner, I was skeptical about listing online. Kaari's team helped me every step of the way, from photography to tenant screening. My property was rented within days!",
    rating: 5,
    author: "Daniel Kimani",
    location: "Nairobi, Kenya",
    image: "https://via.placeholder.com/50",
    tag: "advertiser"
  },
  {
    id: 3,
    content: "The StayProtection policy is what sold me on Kaari. When my hot water heater broke, they had it fixed within 24 hours and even compensated me for the inconvenience.",
    rating: 4,
    author: "Fatima Diallo",
    location: "Dakar, Senegal",
    image: "https://via.placeholder.com/50",
    tag: "tenant"
  },
  {
    id: 4,
    content: "I've been listing my properties on multiple platforms, but Kaari brings in the most reliable tenants. Their verification process is thorough, and I haven't had a single payment issue.",
    rating: 5,
    author: "Emmanuel Adeyemi",
    location: "Accra, Ghana",
    image: "https://via.placeholder.com/50",
    tag: "advertiser"
  },
  {
    id: 5,
    content: "Moving to Johannesburg for work was stressful, but Kaari made finding accommodation easy. The virtual tours saved me time, and the booking process was seamless.",
    rating: 5,
    author: "Thabo Mbeki",
    location: "Johannesburg, South Africa",
    image: "https://via.placeholder.com/50",
    tag: "tenant"
  },
  {
    id: 6,
    content: "The Kaari platform is so intuitive to use. As someone who's not tech-savvy, I appreciated how easy it was to upload my property details and communicate with potential tenants.",
    rating: 4,
    author: "Amina Hassan",
    location: "Kigali, Rwanda",
    image: "https://via.placeholder.com/50",
    tag: "advertiser"
  }
];

const videoTestimonials = [
  {
    id: 1,
    title: "How Kaari Transformed My Rental Business",
    description: "Daniel shares how Kaari helped him increase occupancy rates by 40% for his rental properties in Nairobi.",
    thumbnail: "https://via.placeholder.com/600x340"
  },
  {
    id: 2,
    title: "Finding My Dream Apartment with Kaari",
    description: "Chioma talks about her journey from struggling to find safe housing to discovering her perfect home through Kaari.",
    thumbnail: "https://via.placeholder.com/600x340"
  }
];

const TestimonialsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = React.useState("all");
  
  const filteredTestimonials = activeFilter === "all" 
    ? testimonials 
    : testimonials.filter(testimonial => testimonial.tag === activeFilter);
  
  return (
    <TestimonialsPageStyles>
      <div className="page-header">
        <h1>Customer Testimonials</h1>
        <p className="subtitle">Hear what our users have to say about their Kaari experience</p>
      </div>

      <div className="content-section">
        <div className="testimonials-container">
          <div className="testimonial-filters">
            <button 
              className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Testimonials
            </button>
            <button 
              className={`filter-button ${activeFilter === "tenant" ? "active" : ""}`}
              onClick={() => setActiveFilter("tenant")}
            >
              Tenant Stories
            </button>
            <button 
              className={`filter-button ${activeFilter === "advertiser" ? "active" : ""}`}
              onClick={() => setActiveFilter("advertiser")}
            >
              Advertiser Stories
            </button>
          </div>
          
          <div className="testimonials-grid">
            {filteredTestimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="quote-icon">
                  <FaQuoteLeft />
                </div>
                <div className="testimonial-content">
                  <p>{testimonial.content}</p>
                </div>
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <div className="testimonial-author">
                  <div className="author-image">
                    <img src={testimonial.image} alt={testimonial.author} />
                  </div>
                  <div className="author-details">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-section video-testimonials">
        <h2>Video Testimonials</h2>
        <p>Watch our users share their Kaari experiences in their own words.</p>
        
        <div className="videos-container">
          {videoTestimonials.map(video => (
            <div key={video.id} className="video-card">
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <div className="play-button"></div>
              </div>
              <div className="video-info">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h3>Share Your Kaari Story</h3>
        <p>
          Had a great experience with Kaari? We'd love to hear about it! Share your story and help others discover the benefits of our platform.
        </p>
        <a href="/share-your-story" className="cta-button">
          Share Your Story
        </a>
      </div>
    </TestimonialsPageStyles>
  );
};

export default TestimonialsPage; 