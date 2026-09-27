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
        title: 'Introduction to Data Analytics',
        issuer: 'IBM · Coursera',
        date: '',
        category: 'Foundations',
        image: 'assets/certificates/analytics/ibm-intro-data-analytics.jpg',
        desc: 'The analyst role, the data ecosystem and the end-to-end analysis process.',
        link: ''
      },
      {
        title: 'Excel Basics for Data Analysis',
        issuer: 'IBM · Coursera',
        date: '',
        category: 'Excel',
        image: 'assets/certificates/analytics/ibm-excel-basics.jpg',
        desc: 'Cleaning, wrangling and analysing data in spreadsheets with formulas and pivot tables.',
        link: ''
      },
      {
        title: 'Data Visualization & Dashboards with Excel & Cognos',
        issuer: 'IBM · Coursera',
        date: '',
        category: 'Visualization',
        image: 'assets/certificates/analytics/ibm-data-viz-dashboards.jpg',
        desc: 'Building charts and interactive dashboards in Excel and IBM Cognos Analytics.',
        link: ''
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
  },

  /* ------------------------------------------------------------------------
     ORGANISATION / CORPORATE  (GlobalLogic)
     The five below are starter entries for the areas you mentioned —
     rename them to match the exact certificate titles and add the rest.
     ------------------------------------------------------------------------ */
/*  corporate: {
    title: 'Organisation & Corporate',
    subtitle: 'Mandatory and professional certifications completed at GlobalLogic.',
    items: [
      {
        title: 'Data Security',
        issuer: 'GlobalLogic',
        date: '',
        category: 'Data Security',
        image: '',
        desc: 'Handling, classifying and protecting client and company data.',
        link: ''
      },
      {
        title: 'Device Security',
        issuer: 'GlobalLogic',
        date: '',
        category: 'Device Security',
        image: '',
        desc: 'Keeping laptops, phones and removable media secure and compliant.',
        link: ''
      },
      {
        title: 'Cyber Security Awareness',
        issuer: 'GlobalLogic',
        date: '',
        category: 'Cyber Security',
        image: '',
        desc: 'Recognising phishing, social engineering and everyday security threats.',
        link: ''
      },
      {
        title: 'POSH — Prevention of Sexual Harassment',
        issuer: 'GlobalLogic',
        date: '',
        category: 'POSH',
        image: '',
        desc: 'Workplace conduct, rights and the redressal process under the POSH Act.',
        link: ''
      },
      {
        title: 'Six Sigma',
        issuer: 'GlobalLogic',
        date: '',
        category: 'Six Sigma',
        image: '',
        desc: 'DMAIC and data-driven process improvement to reduce defects and variation.',
        link: ''
      },
    ]
  }
};
*/
