/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

export default function CateSelect(props: {
  podcastCate: string;
  setCate: any;
  [prop: string]: any;
}) {
  const { podcastCate, setCate, ...rest } = props;
  return (
    <select
      {...rest}
      value={podcastCate}
      onChange={(e) => {
        setCate(e.target.value);
      }}
      className="dark:bg-transparent dark:text-gray-300 dark:border-gray-500 mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
    >
      {podcastCate && podcastCate.indexOf('|') > -1 ? (
        <option value={podcastCate} disabled>
          {podcastCate.split('|')[1]}
        </option>
      ) : (
        <option value="" disabled>
          选择播客分类...
        </option>
      )}
      <option value="Arts">Arts</option>
      <option value="Arts|Books">&nbsp;&nbsp;&nbsp;Books</option>
      <option value="Arts|Design">&nbsp;&nbsp;&nbsp;Design</option>
      <option value="Arts|Fashion &amp; Beauty">
        &nbsp;&nbsp;&nbsp;Fashion &amp; Beauty
      </option>
      <option value="Arts|Food">&nbsp;&nbsp;&nbsp;Food</option>
      <option value="Arts|Performing Arts">
        &nbsp;&nbsp;&nbsp;Performing Arts
      </option>
      <option value="Arts|Visual Arts">&nbsp;&nbsp;&nbsp;Visual Arts</option>
      <option value="Business">Business</option>
      <option value="Business|Careers">&nbsp;&nbsp;&nbsp;Careers</option>
      <option value="Business|Entrepreneurship">
        &nbsp;&nbsp;&nbsp;Entrepreneurship
      </option>
      <option value="Business|Investing">&nbsp;&nbsp;&nbsp;Investing</option>
      <option value="Business|Management">&nbsp;&nbsp;&nbsp;Management</option>
      <option value="Business|Marketing">&nbsp;&nbsp;&nbsp;Marketing</option>
      <option value="Business|Non-Profit">&nbsp;&nbsp;&nbsp;Non-Profit</option>
      <option value="Comedy">Comedy</option>
      <option value="Comedy|Comedy Interviews">
        &nbsp;&nbsp;&nbsp;Comedy Interviews
      </option>
      <option value="Comedy|Improv">&nbsp;&nbsp;&nbsp;Improv</option>
      <option value="Comedy|Stand-Up">&nbsp;&nbsp;&nbsp;Stand-Up</option>
      <option value="Education">Education</option>
      <option value="Education|Courses">&nbsp;&nbsp;&nbsp;Courses</option>
      <option value="Education|How To">&nbsp;&nbsp;&nbsp;How To</option>
      <option value="Education|Language Learning">
        &nbsp;&nbsp;&nbsp;Language Learning
      </option>
      <option value="Education|Self-Improvement">
        &nbsp;&nbsp;&nbsp;Self-Improvement
      </option>
      <option value="Fiction">Fiction</option>
      <option value="Fiction|Comedy Fiction">
        &nbsp;&nbsp;&nbsp;Comedy Fiction
      </option>
      <option value="Fiction|Drama">&nbsp;&nbsp;&nbsp;Drama</option>
      <option value="Fiction|Science Fiction">
        &nbsp;&nbsp;&nbsp;Science Fiction
      </option>
      <option value="Government">Government</option>
      <option value="History">History</option>
      <option value="Health &amp; Fitness">Health &amp; Fitness</option>
      <option value="Health &amp; Fitness|Alternative Health">
        &nbsp;&nbsp;&nbsp;Alternative Health
      </option>
      <option value="Health &amp; Fitness|Fitness">
        &nbsp;&nbsp;&nbsp;Fitness
      </option>
      <option value="Health &amp; Fitness|Medicine">
        &nbsp;&nbsp;&nbsp;Medicine
      </option>
      <option value="Health &amp; Fitness|Mental Health">
        &nbsp;&nbsp;&nbsp;Mental Health
      </option>
      <option value="Health &amp; Fitness|Nutrition">
        &nbsp;&nbsp;&nbsp;Nutrition
      </option>
      <option value="Health &amp; Fitness|Sexuality">
        &nbsp;&nbsp;&nbsp;Sexuality
      </option>
      <option value="Kids &amp; Family">Kids &amp; Family</option>
      <option value="Kids &amp; Family|Education for Kids">
        &nbsp;&nbsp;&nbsp;Education for Kids
      </option>
      <option value="Kids &amp; Family|Parenting">
        &nbsp;&nbsp;&nbsp;Parenting
      </option>
      <option value="Kids &amp; Family|Pets &amp; Animals">
        &nbsp;&nbsp;&nbsp;Pets &amp; Animals
      </option>
      <option value="Kids &amp; Family|Stories for Kids">
        &nbsp;&nbsp;&nbsp;Stories for Kids
      </option>
      <option value="Leisure">Leisure</option>
      <option value="Leisure|Animation &amp; Manga">
        &nbsp;&nbsp;&nbsp;Animation &amp; Manga
      </option>
      <option value="Leisure|Automotive">&nbsp;&nbsp;&nbsp;Automotive</option>
      <option value="Leisure|Aviation">&nbsp;&nbsp;&nbsp;Aviation</option>
      <option value="Leisure|Crafts">&nbsp;&nbsp;&nbsp;Crafts</option>
      <option value="Leisure|Games">&nbsp;&nbsp;&nbsp;Games</option>
      <option value="Leisure|Hobbies">&nbsp;&nbsp;&nbsp;Hobbies</option>
      <option value="Leisure|Home &amp; Garden">
        &nbsp;&nbsp;&nbsp;Home &amp; Garden
      </option>
      <option value="Leisure|Video Games">&nbsp;&nbsp;&nbsp;Video Games</option>
      <option value="Music">Music</option>
      <option value="Music|Music Commentary">
        &nbsp;&nbsp;&nbsp;Music Commentary
      </option>
      <option value="Music|Music History">
        &nbsp;&nbsp;&nbsp;Music History
      </option>
      <option value="Music|Music Interviews">
        &nbsp;&nbsp;&nbsp;Music Interviews
      </option>
      <option value="News">News</option>
      <option value="News|Business News">
        &nbsp;&nbsp;&nbsp;Business News
      </option>
      <option value="News|Daily News">&nbsp;&nbsp;&nbsp;Daily News</option>
      <option value="News|Entertainment News">
        &nbsp;&nbsp;&nbsp;Entertainment News
      </option>
      <option value="News|News Commentary">
        &nbsp;&nbsp;&nbsp;News Commentary
      </option>
      <option value="News|Politics">&nbsp;&nbsp;&nbsp;Politics</option>
      <option value="News|Sports News">&nbsp;&nbsp;&nbsp;Sports News</option>
      <option value="News|Tech News">&nbsp;&nbsp;&nbsp;Tech News</option>
      <option value="Religion &amp; Spirituality">
        Religion &amp; Spirituality
      </option>
      <option value="Religion &amp; Spirituality|Buddhism">
        &nbsp;&nbsp;&nbsp;Buddhism
      </option>
      <option value="Religion &amp; Spirituality|Christianity">
        &nbsp;&nbsp;&nbsp;Christianity
      </option>
      <option value="Religion &amp; Spirituality|Hinduism">
        &nbsp;&nbsp;&nbsp;Hinduism
      </option>
      <option value="Religion &amp; Spirituality|Islam">
        &nbsp;&nbsp;&nbsp;Islam
      </option>
      <option value="Religion &amp; Spirituality|Judaism">
        &nbsp;&nbsp;&nbsp;Judaism
      </option>
      <option value="Religion &amp; Spirituality|Religion">
        &nbsp;&nbsp;&nbsp;Religion
      </option>
      <option value="Religion &amp; Spirituality|Spirituality">
        &nbsp;&nbsp;&nbsp;Spirituality
      </option>
      <option value="Science">Science</option>
      <option value="Science|Astronomy">&nbsp;&nbsp;&nbsp;Astronomy</option>
      <option value="Science|Chemistry">&nbsp;&nbsp;&nbsp;Chemistry</option>
      <option value="Science|Earth Sciences">
        &nbsp;&nbsp;&nbsp;Earth Sciences
      </option>
      <option value="Science|Life Sciences">
        &nbsp;&nbsp;&nbsp;Life Sciences
      </option>
      <option value="Science|Mathematics">&nbsp;&nbsp;&nbsp;Mathematics</option>
      <option value="Science|Natural Sciences">
        &nbsp;&nbsp;&nbsp;Natural Sciences
      </option>
      <option value="Science|Nature">&nbsp;&nbsp;&nbsp;Nature</option>
      <option value="Science|Physics">&nbsp;&nbsp;&nbsp;Physics</option>
      <option value="Science|Social Sciences">
        &nbsp;&nbsp;&nbsp;Social Sciences
      </option>
      <option value="Society &amp; Culture">Society &amp; Culture</option>
      <option value="Society &amp; Culture|Documentary">
        &nbsp;&nbsp;&nbsp;Documentary
      </option>
      <option value="Society &amp; Culture|Personal Journals">
        &nbsp;&nbsp;&nbsp;Personal Journals
      </option>
      <option value="Society &amp; Culture|Philosophy">
        &nbsp;&nbsp;&nbsp;Philosophy
      </option>
      <option value="Society &amp; Culture|Places &amp; Travel">
        &nbsp;&nbsp;&nbsp;Places &amp; Travel
      </option>
      <option value="Society &amp; Culture|Relationships">
        &nbsp;&nbsp;&nbsp;Relationships
      </option>
      <option value="Sports">Sports</option>
      <option value="Sports|Baseball">&nbsp;&nbsp;&nbsp;Baseball</option>
      <option value="Sports|Basketball">&nbsp;&nbsp;&nbsp;Basketball</option>
      <option value="Sports|Cricket">&nbsp;&nbsp;&nbsp;Cricket</option>
      <option value="Sports|Fantasy Sports">
        &nbsp;&nbsp;&nbsp;Fantasy Sports
      </option>
      <option value="Sports|Football">&nbsp;&nbsp;&nbsp;Football</option>
      <option value="Sports|Golf">&nbsp;&nbsp;&nbsp;Golf</option>
      <option value="Sports|Hockey">&nbsp;&nbsp;&nbsp;Hockey</option>
      <option value="Sports|Rugby">&nbsp;&nbsp;&nbsp;Rugby</option>
      <option value="Sports|Running">&nbsp;&nbsp;&nbsp;Running</option>
      <option value="Sports|Soccer">&nbsp;&nbsp;&nbsp;Soccer</option>
      <option value="Sports|Swimming">&nbsp;&nbsp;&nbsp;Swimming</option>
      <option value="Sports|Tennis">&nbsp;&nbsp;&nbsp;Tennis</option>
      <option value="Sports|Volleyball">&nbsp;&nbsp;&nbsp;Volleyball</option>
      <option value="Sports|Wilderness">&nbsp;&nbsp;&nbsp;Wilderness</option>
      <option value="Sports|Wrestling">&nbsp;&nbsp;&nbsp;Wrestling</option>
      <option value="Technology">Technology</option>
      <option value="True Crime">True Crime</option>
      <option value="TV &amp; Film">TV &amp; Film</option>
      <option value="TV &amp; Film|After Shows">
        &nbsp;&nbsp;&nbsp;After Shows
      </option>
      <option value="TV &amp; Film|Film History">
        &nbsp;&nbsp;&nbsp;Film History
      </option>
      <option value="TV &amp; Film|Film Interviews">
        &nbsp;&nbsp;&nbsp;Film Interviews
      </option>
      <option value="TV &amp; Film|Film Reviews">
        &nbsp;&nbsp;&nbsp;Film Reviews
      </option>
      <option value="TV &amp; Film|TV Reviews">
        &nbsp;&nbsp;&nbsp;TV Reviews
      </option>
    </select>
  );
}
