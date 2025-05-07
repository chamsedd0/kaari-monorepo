import React from 'react';
import { StaticPageWrapper } from '../../components/styles/static-page-styles';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';

// Additional styles for the blog page
const BlogPageStyles = styled(StaticPageWrapper)`
  .blog-posts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 40px;
  }
  
  .blog-post {
    border-radius: ${Theme.borders.radius.md};
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    }
    
    .post-image {
      width: 100%;
      height: 200px;
      background-color: ${Theme.colors.tertiary}20;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .category {
        position: absolute;
        top: 15px;
        left: 15px;
        background-color: ${Theme.colors.primary};
        color: white;
        font: ${Theme.typography.fonts.smallB};
        padding: 5px 10px;
        border-radius: ${Theme.borders.radius.full};
      }
    }
    
    .post-content {
      padding: 20px;
      
      .date {
        font: ${Theme.typography.fonts.smallM};
        color: ${Theme.colors.gray2};
        margin-bottom: 10px;
      }
      
      h3 {
        font: ${Theme.typography.fonts.h4};
        color: ${Theme.colors.black};
        margin-bottom: 10px;
      }
      
      p {
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.gray2};
        margin-bottom: 20px;
      }
      
      .read-more {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.secondary};
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .blog-posts {
      grid-template-columns: 1fr;
    }
  }
`;

const BlogPage: React.FC = () => {
  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Neighborhoods for Renters in Lagos",
      excerpt: "Discover the best areas to rent in Lagos based on affordability, amenities, and commute times.",
      category: "City Guides",
      date: "May 15, 2023",
      imageUrl: "https://via.placeholder.com/600x400"
    },
    {
      id: 2,
      title: "How to Negotiate Your Rent Successfully",
      excerpt: "Learn effective strategies to negotiate your rent and save money on your next lease agreement.",
      category: "Renting Tips",
      date: "April 28, 2023",
      imageUrl: "https://via.placeholder.com/600x400"
    },
    {
      id: 3,
      title: "Understanding Tenant Rights in Kenya",
      excerpt: "A comprehensive guide to your rights as a tenant in Kenya and how to protect yourself.",
      category: "Legal",
      date: "April 10, 2023",
      imageUrl: "https://via.placeholder.com/600x400"
    },
    {
      id: 4,
      title: "Decorating Your Rental: Tips for a Personalized Space",
      excerpt: "Ideas for making your rental feel like home without breaking lease agreements.",
      category: "Interior Design",
      date: "March 22, 2023",
      imageUrl: "https://via.placeholder.com/600x400"
    },
    {
      id: 5,
      title: "The Rise of Co-living Spaces in African Cities",
      excerpt: "Exploring the growing trend of co-living and what it means for the future of renting.",
      category: "Trends",
      date: "March 5, 2023",
      imageUrl: "https://via.placeholder.com/600x400"
    },
    {
      id: 6,
      title: "Property Investment Opportunities in Emerging Markets",
      excerpt: "A look at the most promising areas for property investment across the continent.",
      category: "Investment",
      date: "February 18, 2023",
      imageUrl: "https://via.placeholder.com/600x400"
    }
  ];

  return (
    <BlogPageStyles>
      <div className="page-header">
        <h1>Kaari Blog</h1>
        <p className="subtitle">Insights, tips, and updates on renting and real estate in Africa</p>
      </div>

      <div className="content-section">
        <h2>Latest Articles</h2>
        <div className="blog-posts">
          {blogPosts.map(post => (
            <div key={post.id} className="blog-post">
              <div className="post-image">
                <img src={post.imageUrl} alt={post.title} />
                <span className="category">{post.category}</span>
              </div>
              <div className="post-content">
                <div className="date">{post.date}</div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <a href={`/blog/${post.id}`} className="read-more">Read More</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h3>Stay Updated</h3>
        <p>
          Subscribe to our newsletter to receive the latest articles, tips, and updates from the Kaari blog.
        </p>
        <a href="/subscribe" className="cta-button">
          Subscribe Now
        </a>
      </div>
    </BlogPageStyles>
  );
};

export default BlogPage; 