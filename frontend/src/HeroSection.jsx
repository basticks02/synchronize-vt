import React from 'react'

export default function HeroSection({title}) {
  return (
    <section className="myprofilehero">
      <video className="video-background" autoPlay loop muted>
        <source src="https://res.cloudinary.com/dvbfkbehg/video/upload/v1721619091/hero_wrg6v9.mov" type="video/mp4" />
      </video>
      <div className="hero-content">
        <h1>{title}</h1>
      </div>
    </section>
  )
}
