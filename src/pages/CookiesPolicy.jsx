import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const CookiesPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Cookie Policy</h1>
      
      <div className="space-y-6">
        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-white">What Are Cookies?</h2>
          <p className="text-gray-300 mb-4">
            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-white">Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Essential Cookies</h3>
              <p className="text-gray-300">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You may disable these by changing your browser settings, but this may affect how the website functions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Analytics Cookies</h3>
              <p className="text-gray-300">
                We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience. All information these cookies collect is aggregated and therefore anonymous.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Functionality Cookies</h3>
              <p className="text-gray-300">
                These cookies allow the website to remember choices you make (such as your preferred language or the region you are in) and provide enhanced, more personal features.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Advertising Cookies</h3>
              <p className="text-gray-300">
                These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of advertising campaigns.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-white">How Long Do Cookies Last?</h2>
          <div className="space-y-2 text-gray-300">
            <p>We use two types of cookies based on their duration:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Session Cookies: These cookies are temporary and expire when you close your browser.</li>
              <li>Persistent Cookies: These cookies remain on your device until they expire or you delete them.</li>
            </ul>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-white">Managing Cookies</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
            </p>
            <p>
              To manage cookies in your browser:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Chrome: Settings → Privacy and Security → Cookies and other site data</li>
              <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
              <li>Safari: Preferences → Privacy → Cookies and website data</li>
              <li>Edge: Settings → Privacy, search and services → Clear browsing data</li>
            </ul>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-white">Third-Party Cookies</h2>
          <p className="text-gray-300">
            We use services from these third parties that may set cookies:
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>Google Analytics (analytics)</li>
            <li>Stripe (payment processing)</li>
            <li>Cloudflare (content delivery and security)</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-white">Updates to This Policy</h2>
          <p className="text-gray-300">
            We may update this Cookie Policy from time to time. We encourage you to periodically review this page for the latest information about our cookie practices.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@ivisionary.com" className="text-blue-400 hover:underline">
              privacy@ivisionary.com
            </a>
          </p>
          <div className="mt-4">
            <Link to="/privacy" className="text-blue-400 hover:underline">
              View our Privacy Policy
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CookiesPolicy;