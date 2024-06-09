<script setup lang="ts">

</script>

<template>
  <div class="disclaimer-container">
    <div class="header">disclaimer</div>
    <div class="update">Last updated: November 01, 2023</div>
    <div class="header-main">Interpretation and Definitions</div>
    <div class="header-sub">Interpretation</div>
    <div class="text">The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</div>
    <div class="header-sub">Definitions</div>
    <div class="text">
      For the purposes of this Disclaimer:
      <ul>
        <li><span class="bold">Company </span>(referred to as either "the Company", "We", "Us" or "Our" in this Disclaimer) refers to moonwitch.</li>
        <li><span class="bold">Service </span>refers to the Website.</li>
        <li><span class="bold">You </span>means the individual accessing the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
        <li><span class="bold">Website </span>refers to moonwitch, accessible from <a href="http://www.moonwitch.art"></a>http://www.moonwitch.art</li>
      </ul>
    </div>
    <div class="header-main">Disclaimer</div>
    <div class="text">The information contained on the Service is for general information purposes only.</div>
    <div class="text">The Company assumes no responsibility for errors or omissions in the contents of the Service.</div>
    <div class="text">In no event shall the Company be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. The Company reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice.</div>
    <div class="text">The Company does not warrant that the Service is free of viruses or other harmful components.</div>
    <div class="header-main">External Links Disclaimer</div>
    <div class="text">The information given by the Service is for general guidance on matters of interest only. Even if the Company takes every precaution to ensure that the content of the Service is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules and regulations, there may be delays, omissions or inaccuracies in the information contained on the Service.</div>
    <div class="text">The Company is not responsible for any errors or omissions, or for the results obtained from the use of this information.</div>
    <div class="header-main">Fair Use Disclaimer</div>
    <div class="text">The Company may use copyrighted material which has not always been specifically authorized by the copyright owner. The Company is making such material available for criticism, comment, news reporting, teaching, scholarship, or research.</div>
    <div class="text">The Company believes this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the United States Copyright law.</div>
    <div class="text">If You wish to use copyrighted material from the Service for your own purposes that go beyond fair use, You must obtain permission from the copyright owner.</div>
    <div class="header-main">Views Expressed Disclaimer</div>
    <div class="text">The Service may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other author, agency, organization, employer or company, including the Company.</div>
    <div class="text">Comments published by users are their sole responsibility and the users will take full responsibility, liability and blame for any libel or litigation that results from something written in or as a direct result of something written in a comment. The Company is not liable for any comment published by users and reserves the right to delete any comment for any reason whatsoever.</div>
    <div class="header-main">No Responsibility Disclaimer</div>
    <div class="text">The information on the Service is provided with the understanding that the Company is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal or other competent advisers.</div>
    <div class="text">In no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the Service.</div>
    <div class="header-main">"Use at Your Own Risk" Disclaimer</div>
    <div class="text">All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.</div>
    <div class="text">The Company will not be liable to You or anyone else for any decision made or action taken in reliance on the information given by the Service or for any consequential, special or similar damages, even if advised of the possibility of such damages.</div>
    <div class="header-main">Contact Us</div>
    <div class="text">
      If you have any questions about this Disclaimer, You can contact Us:
      <ul>
        <li>By <LocLink to="/contact" class="link">contact form</LocLink>.</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.disclaimer-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  color: $secondary;
  flex-direction: column;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    padding: 0 15rem;
  }

  .bold {
    font-weight: bold;
  }

  .header {
    font-size: 50px;
  }

  .update {
    font-style: italic;
    font-size: 15px;
    margin-bottom: 2rem;
  }

  .header-main {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .header-sub {
    font-size: 25px;
    margin-bottom: 1rem;
  }

  .text {
    margin-bottom: 1.5rem;
  }

  ul {
    margin-top: 1rem;
    padding-left: 2rem;

    li {
      margin-top: 1rem;

      .link {
        color: $alt;

        &:hover {
          color: $active;
        }
      }
    }
  }
}
</style>