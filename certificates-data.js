/* ==========================================================================
   CERTIFICATES — this is the only file you need to edit to add certificates.
   --------------------------------------------------------------------------
   HOW TO ADD ONE
   1. Save the certificate as an image (JPG/PNG, landscape is best) into:
        assets/certificates/analytics/   ← Coursera / data analytics
        assets/certificates/corporate/   ← GlobalLogic / organisation
   2. Copy one { ... } block below, paste it into the right list, fill it in.

   FIELDS
     title     (required) certificate name
     issuer    who issued it, e.g. "IBM · Coursera" or "GlobalLogic"
     date      e.g. "Mar 2025" (optional)
     category  groups cards into filter chips at the top of the page
     image     path to the image file (leave "" to show a placeholder card)
     desc      the one-liner shown under the card
     link      verification URL (optional, e.g. Coursera "verify" link)

   Cards appear in the same order as this list. The counts on the home-page
   folders update automatically.
   ========================================================================== */

window.CERTIFICATES = {

  /* ------------------------------------------------------------------------
     DATA ANALYTICS  (Coursera)
     ------------------------------------------------------------------------ */
  analytics: {
    title: 'Data Analytics',
    subtitle: 'Coursework on the full analytics workflow — collecting, cleaning, analysing and presenting data.',
    items: [
        {
        title: 'Six Sigma Yellow Belt',
        issuer: 'GlobalLogic · Linkedin Learning',
        date: 'Sept 2026',
        category: 'Yellow Belt',
        image: 'assets/certificates/analytics/Six_sigma_yellow_belt.jpg',
        desc: 'A well-informed project team member who assists with data collection, basic analysis, and process mapping.',
        link: ''
      },
      {
        title: 'Data Analysis and Visualization Foundations',
        issuer: 'IBM · Coursera',
        date: 'Sept 2024',
        category: 'Data Analysis',
        image: 'assets/certificates/analytics/Data_analysis.jpg',
        desc: 'Introduction to Data Analytics, Excel Basics for Data Analysis, Data Visualization and Dashboards with Excel and Cognos, Assessment for Data Analysis and Visualization Foundations',
        link: 'https://www.coursera.org/account/accomplishments/specialization/8D3S9LJOORKM'
      },
      {
        title: 'Business Intelligence and data analytics: Generate insights',
        issuer: 'MACQUARIE University · Coursera',
        date: 'Sep 2024',
        category: 'Business Intellegence',
        image: 'assets/certificates/analytics/Business_intellegence.jpg',
        desc: 'Dashboard Creation, Trend Analysis, Data Presentation, Business Intelligence, Interactive Data Visualization, Data Ethics, Business Analytics, Data-Driven Decision-Making, Data Visualization, Analytics',
        link: 'https://www.coursera.org/account/accomplishments/verify/TIXWQJSWMB9N'
      },
      {
        title: 'Python 3 Programming',
        issuer: 'University of MICHIGAN · Coursera',
        date: 'Sep 2023',
        category: 'Python',
        image: 'assets/certificates/analytics/Python_programming.jpg',
        desc: 'Python Basics, Python Functions, Files, and Dictionaries, Data Collection and Processing with Python, Python Classes and Inheritance',
        link: 'https://www.coursera.org/account/accomplishments/specialization/N3YTXS4WPVB2'
      },
      // ↓ copy a block like the one below for each new Coursera certificate
      // {
      //   title: 'Certificate name',
      //   issuer: 'Provider · Coursera',
      //   date: 'Mon YYYY',
      //   category: 'SQL',
      //   image: 'assets/certificates/analytics/file-name.jpg',
      //   desc: 'One line about what you learned.',
      //   link: 'https://coursera.org/verify/XXXXXXX'
      // },
    ]
  }
}

 
