import './About.css';

function About() {
  return (
    <section className="about">
      <h2 className="about__title">About MusicFetch</h2>

      <p className="about__text">
        MusicFetch queries the Verome API to gather the profile of an artist or
        an album: its image, its discography and its most played songs. Every
        search generates a card you can keep.
      </p>

      <p className="about__text">
        Your feed is private: only you see the cards you have saved. This
        project is the final assignment of the TripleTen web development
        bootcamp, built with React and no third-party interface libraries.
      </p>
    </section>
  );
}

export default About;
