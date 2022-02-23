/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useI18n } from '../../hooks';

export default function CateSelect(props: {
  podcastCate: string;
  setCate: any;
  [prop: string]: any;
}) {
  const { t } = useI18n();
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
          {t('choosePodcastCategory')}
        </option>
      )}
      <option value="Arts">{t('podcastCategories.arts')}</option>
      <option value="Arts|Books">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.books')}
      </option>
      <option value="Arts|Design">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.design')}
      </option>
      <option value="Arts|Fashion &amp; Beauty">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.fashionAndBeauty')}
      </option>
      <option value="Arts|Food">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.food')}
      </option>
      <option value="Arts|Performing Arts">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.performingArts')}
      </option>
      <option value="Arts|Visual Arts">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.visualArts')}
      </option>
      <option value="Business">{t('podcastCategories.business')}</option>
      <option value="Business|Careers">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.careers')}
      </option>
      <option value="Business|Entrepreneurship">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.entrepreneurship')}
      </option>
      <option value="Business|Investing">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.investing')}
      </option>
      <option value="Business|Management">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.management')}
      </option>
      <option value="Business|Marketing">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.marketing')}
      </option>
      <option value="Business|Non-Profit">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.nonProfit')}
      </option>
      <option value="Comedy">{t('podcastCategories.comedy')}</option>
      <option value="Comedy|Comedy Interviews">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.comedyInterviews')}
      </option>
      <option value="Comedy|Improv">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.improv')}
      </option>
      <option value="Comedy|Stand-Up">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.standup')}
      </option>
      <option value="Education">{t('podcastCategories.education')}</option>
      <option value="Education|Courses">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.courses')}
      </option>
      <option value="Education|How To">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.howTo')}
      </option>
      <option value="Education|Language Learning">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.languageLearning')}
      </option>
      <option value="Education|Self-Improvement">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.selfImprovement')}
      </option>
      <option value="Fiction">{t('podcastCategories.fiction')}</option>
      <option value="Fiction|Comedy Fiction">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.comedyFiction')}
      </option>
      <option value="Fiction|Drama">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.drama')}
      </option>
      <option value="Fiction|Science Fiction">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.scienceFiction')}
      </option>
      <option value="Government">{t('podcastCategories.government')}</option>
      <option value="History">{t('podcastCategories.history')}</option>
      <option value="Health &amp; Fitness">
        {t('podcastCategories.healthAndFitness')}
      </option>
      <option value="Health &amp; Fitness|Alternative Health">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.alternativeHealth')}
      </option>
      <option value="Health &amp; Fitness|Fitness">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.fitness')}
      </option>
      <option value="Health &amp; Fitness|Medicine">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.medicine')}
      </option>
      <option value="Health &amp; Fitness|Mental Health">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.mentalHealth')}
      </option>
      <option value="Health &amp; Fitness|Nutrition">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.nutrition')}
      </option>
      <option value="Health &amp; Fitness|Sexuality">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.sexuality')}
      </option>
      <option value="Kids &amp; Family">
        {t('podcastCategories.kidsAndFamily')}
      </option>
      <option value="Kids &amp; Family|Education for Kids">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.educationForKids')}
      </option>
      <option value="Kids &amp; Family|Parenting">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.parenting')}
      </option>
      <option value="Kids &amp; Family|Pets &amp; Animals">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.petsAndAnimals')}
      </option>
      <option value="Kids &amp; Family|Stories for Kids">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.storiesForKids')}
      </option>
      <option value="Leisure">{t('podcastCategories.leisure')}</option>
      <option value="Leisure|Animation &amp; Manga">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.animationAndManga')}
      </option>
      <option value="Leisure|Automotive">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.automotive')}
      </option>
      <option value="Leisure|Aviation">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.aviation')}
      </option>
      <option value="Leisure|Crafts">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.crafts')}
      </option>
      <option value="Leisure|Games">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.games')}
      </option>
      <option value="Leisure|Hobbies">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.hobbies')}
      </option>
      <option value="Leisure|Home &amp; Garden">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.homeAndGarden')}
      </option>
      <option value="Leisure|Video Games">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.videoGames')}
      </option>
      <option value="Music">{t('podcastCategories.music')}</option>
      <option value="Music|Music Commentary">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.musicCommentary')}
      </option>
      <option value="Music|Music History">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.musicHistory')}
      </option>
      <option value="Music|Music Interviews">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.musicInterviews')}
      </option>
      <option value="News">{t('podcastCategories.news')}</option>
      <option value="News|Business News">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.businessNews')}
      </option>
      <option value="News|Daily News">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.dailyNews')}
      </option>
      <option value="News|Entertainment News">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.entertainmentNews')}
      </option>
      <option value="News|News Commentary">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.newsCommentary')}
      </option>
      <option value="News|Politics">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.politics')}
      </option>
      <option value="News|Sports News">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.sportsNews')}
      </option>
      <option value="News|Tech News">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.techNews')}
      </option>
      <option value="Religion &amp; Spirituality">
        {t('podcastCategories.religionAndSpirituality')}
      </option>
      <option value="Religion &amp; Spirituality|Buddhism">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.buddhism')}
      </option>
      <option value="Religion &amp; Spirituality|Christianity">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.christianity')}
      </option>
      <option value="Religion &amp; Spirituality|Hinduism">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.hinduism')}
      </option>
      <option value="Religion &amp; Spirituality|Islam">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.islam')}
      </option>
      <option value="Religion &amp; Spirituality|Judaism">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.judaism')}
      </option>
      <option value="Religion &amp; Spirituality|Religion">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.religion')}
      </option>
      <option value="Religion &amp; Spirituality|Spirituality">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.spirituality')}
      </option>
      <option value="Science">{t('podcastCategories.science')}</option>
      <option value="Science|Astronomy">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.astronomy')}
      </option>
      <option value="Science|Chemistry">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.chemistry')}
      </option>
      <option value="Science|Earth Sciences">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.earthSciences')}
      </option>
      <option value="Science|Life Sciences">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.lifeSciences')}
      </option>
      <option value="Science|Mathematics">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.math')}
      </option>
      <option value="Science|Natural Sciences">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.naturalSciences')}
      </option>
      <option value="Science|Nature">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.nature')}
      </option>
      <option value="Science|Physics">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.physics')}
      </option>
      <option value="Science|Social Sciences">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.socialSciences')}
      </option>
      <option value="Society &amp; Culture">
        {t('podcastCategories.societyAndCulture')}
      </option>
      <option value="Society &amp; Culture|Documentary">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.documentary')}
      </option>
      <option value="Society &amp; Culture|Personal Journals">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.personalJournals')}
      </option>
      <option value="Society &amp; Culture|Philosophy">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.philosophy')}
      </option>
      <option value="Society &amp; Culture|Places &amp; Travel">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.placesAndTravel')}
      </option>
      <option value="Society &amp; Culture|Relationships">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.relationships')}
      </option>
      <option value="Sports">{t('podcastCategories.sports')}</option>
      <option value="Sports|Baseball">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.baseball')}
      </option>
      <option value="Sports|Basketball">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.basketball')}
      </option>
      <option value="Sports|Cricket">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.cricket')}
      </option>
      <option value="Sports|Fantasy Sports">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.fantasySports')}
      </option>
      <option value="Sports|Football">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.football')}
      </option>
      <option value="Sports|Golf">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.golf')}
      </option>
      <option value="Sports|Hockey">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.hockey')}
      </option>
      <option value="Sports|Rugby">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.rugby')}
      </option>
      <option value="Sports|Running">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.running')}
      </option>
      <option value="Sports|Soccer">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.soccer')}
      </option>
      <option value="Sports|Swimming">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.swimming')}
      </option>
      <option value="Sports|Tennis">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.tennis')}
      </option>
      <option value="Sports|Volleyball">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.volleyball')}
      </option>
      <option value="Sports|Wilderness">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.wilderness')}
      </option>
      <option value="Sports|Wrestling">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.wrestling')}
      </option>
      <option value="Technology">{t('podcastCategories.technology')}</option>
      <option value="True Crime">{t('podcastCategories.trueCrime')}</option>
      <option value="TV &amp; Film">{t('podcastCategories.tvAndFilm')}</option>
      <option value="TV &amp; Film|After Shows">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.afterShows')}
      </option>
      <option value="TV &amp; Film|Film History">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.filmHistory')}
      </option>
      <option value="TV &amp; Film|Film Interviews">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.filmInterviews')}
      </option>
      <option value="TV &amp; Film|Film Reviews">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.filmReviews')}
      </option>
      <option value="TV &amp; Film|TV Reviews">
        &nbsp;&nbsp;&nbsp;{t('podcastCategories.tvReviews')}
      </option>
    </select>
  );
}
