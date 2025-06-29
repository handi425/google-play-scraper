-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 29, 2025 at 02:32 PM
-- Server version: 8.0.36-28
-- PHP Version: 8.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gplay`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `category_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_id`, `name`, `created_at`) VALUES
(1, 'GAME', 'Games', '2025-06-29 11:22:50'),
(2, 'GAME_ACTION', 'Action', '2025-06-29 11:22:50'),
(3, 'GAME_ADVENTURE', 'Adventure', '2025-06-29 11:22:50'),
(4, 'GAME_ARCADE', 'Arcade', '2025-06-29 11:22:50'),
(5, 'GAME_BOARD', 'Board', '2025-06-29 11:22:50'),
(6, 'GAME_CARD', 'Card', '2025-06-29 11:22:50'),
(7, 'GAME_CASINO', 'Casino', '2025-06-29 11:22:50'),
(8, 'GAME_CASUAL', 'Casual', '2025-06-29 11:22:50'),
(9, 'GAME_EDUCATIONAL', 'Educational', '2025-06-29 11:22:50'),
(10, 'GAME_MUSIC', 'Music', '2025-06-29 11:22:50'),
(11, 'GAME_PUZZLE', 'Puzzle', '2025-06-29 11:22:50'),
(12, 'GAME_RACING', 'Racing', '2025-06-29 11:22:50'),
(13, 'GAME_ROLE_PLAYING', 'Role Playing', '2025-06-29 11:22:50'),
(14, 'GAME_SIMULATION', 'Simulation', '2025-06-29 11:22:50'),
(15, 'GAME_SPORTS', 'Sports', '2025-06-29 11:22:50'),
(16, 'GAME_STRATEGY', 'Strategy', '2025-06-29 11:22:50'),
(17, 'GAME_TRIVIA', 'Trivia', '2025-06-29 11:22:50'),
(18, 'GAME_WORD', 'Word', '2025-06-29 11:22:50');

-- --------------------------------------------------------

--
-- Table structure for table `developers`
--

CREATE TABLE `developers` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `developer_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `website` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `developers`
--

INSERT INTO `developers` (`id`, `name`, `developer_id`, `email`, `website`, `created_at`) VALUES
(1, 'Roblox Corporation', '5360036014478858866', 'info@roblox.com', 'http://www.roblox.com', '2025-06-29 12:28:39'),
(2, 'HungryStudio', '6272993483096524210', 'blockblast-support@hungrystudio.com', 'https://hungrystudio.com?utm_source=googleplay&utm_medium=referral&utm_campaign=visitwebsite', '2025-06-29 12:28:39'),
(3, 'Dream Games, Ltd.', 'Dream+Games,+Ltd.', 'royalkingdom@dreamgames.com', 'https://dreamgames.helpshift.com/hc/en/6-royal-kingdom', '2025-06-29 12:28:40'),
(4, 'SEGA CORPORATION', 'SEGA+CORPORATION', 'customersupport@sega.com', 'https://persona5x.com', '2025-06-29 12:28:40'),
(5, 'Supercent, Inc.', '6384832178452405684', 'help@supercent.io', 'http://supercent.io/', '2025-06-29 12:28:40'),
(6, 'Melodya Muses', 'Melodya+Muses', 'bunbunstudio@outlook.com', 'https://magicblocktiles2.netlify.app/app-ads.txt', '2025-06-29 12:28:41'),
(7, 'VOODOO', 'VOODOO', 'holeio@voodoo.io', 'https://www.voodoo.io', '2025-06-29 12:28:41'),
(8, 'Oakever Games', '9154199097976797965', 'support@oakevergames.com', 'https://oakevergames.com/', '2025-06-29 12:28:41'),
(9, 'Vita Studio.', '5970603563954352511', 'support@vitastudio.ai', 'https://www.vitastudio.ai', '2025-06-29 12:28:41'),
(10, 'Cygames, Inc.', 'Cygames,+Inc.', 'info_umamusume_en@cygames.co.jp', NULL, '2025-06-29 12:28:42'),
(11, 'WhatsApp LLC', 'WhatsApp+LLC', 'android@support.whatsapp.com', 'http://www.whatsapp.com/', '2025-06-29 12:28:42'),
(12, 'Meta Platforms, Inc.', 'Meta+Platforms,+Inc.', 'android-support@fb.com', 'https://www.facebook.com/games/fbmessenger_android/', '2025-06-29 12:28:43'),
(13, 'Telegram FZ-LLC', 'Telegram+FZ-LLC', 'support@telegram.org', 'https://telegram.org', '2025-06-29 12:28:43'),
(14, 'Snap Inc', 'Snap+Inc', 'snapchat@snap.com', 'http://www.snapchat.com', '2025-06-29 12:28:43'),
(15, 'Discord Inc.', 'Discord+Inc.', 'support@discord.com', 'https://dis.gd/contact', '2025-06-29 12:28:43'),
(16, 'TextNow, Inc.', '8273134989898180729', 'community@textnow.com', 'http://www.textnow.com', '2025-06-29 12:28:44'),
(17, 'Microsoft Corporation', '6720847872553662727', 'edge_ef@microsoft.com', 'https://www.microsoft.com', '2025-06-29 12:28:44'),
(18, 'Signal Foundation', 'Signal+Foundation', 'support@signal.org', 'https://signal.org', '2025-06-29 12:28:44'),
(19, 'Homescreen Apps', '6122101642657830435', 'contact@eetapps.com', 'https://inboxhomescreen.com/', '2025-06-29 12:28:45'),
(20, 'TikTok Pte. Ltd.', 'TikTok+Pte.+Ltd.', 'feedback@tiktok.com', 'https://www.tiktok.com/', '2025-06-29 12:28:45'),
(21, 'Instagram', 'Instagram', 'instagram-android@meta.com', 'http://help.instagram.com/', '2025-06-29 12:28:45'),
(22, 'Humans, Inc', 'Humans,+Inc', 'wecare@flipfit.com', 'https://flip.shop', '2025-06-29 12:28:47'),
(23, 'reddit Inc.', 'reddit+Inc.', 'androidsupport@reddit.com', 'https://www.reddit.com/mobile/download', '2025-06-29 12:28:47'),
(24, 'Bigo Technology Pte. Ltd.', '4859973809643210411', 'feedback@bigo.tv', 'https://www.bigo.tv/', '2025-06-29 12:28:47'),
(25, 'Happeny Technology Pte. Ltd.', 'Happeny+Technology+Pte.+Ltd.', 'service@widgetable.net', 'https://widgetable.net', '2025-06-29 12:28:48'),
(26, 'STORYMATRIX', 'STORYMATRIX', 'feedback@dramabox.com', 'https://www.dramabox.com', '2025-06-29 12:28:48'),
(27, 'Netflix, Inc.', '6891422865930303475', 'playstore@netflix.com', 'http://www.netflix.com', '2025-06-29 12:28:48'),
(28, 'Kennedyy', 'Kennedyy', 'zhangshuqing43zz@gmail.com', 'https://timeappmarketing.com/app-ads.txt', '2025-06-29 12:28:49'),
(29, 'Peacock TV LLC', 'Peacock+TV+LLC', 'support@help.peacocktv.com', 'https://www.peacocktv.com', '2025-06-29 12:28:49'),
(30, 'Roku, Inc. & its affiliates', 'Roku,+Inc.+%26+its+affiliates', 'feedback@roku.com', 'https://www.roku.com', '2025-06-29 12:28:49'),
(31, 'Pluto, Inc.', 'Pluto,+Inc.', 'support@pluto.tv', 'http://pluto.tv/support', '2025-06-29 12:28:50'),
(32, 'WarnerMedia Global Digital Services, LLC', 'WarnerMedia+Global+Digital+Services,+LLC', 'support@max.com', 'https://help.max.com', '2025-06-29 12:28:50'),
(33, 'Disney', 'Disney', 'disneyplushelp@disney.com', 'https://help.disneyplus.com', '2025-06-29 12:28:50'),
(34, 'Tubi TV', '9005207387328486775', 'support@tubi.tv', 'https://tubitv.com', '2025-06-29 12:28:51'),
(35, 'Amazon Mobile LLC', 'Amazon+Mobile+LLC', 'pv-android-feedback@amazon.com', 'http://www.primevideo.com', '2025-06-29 12:28:51'),
(36, 'Century Games PTE. LTD.', '6832375891198423999', 'contact_kingshot@centurygame.com', NULL, '2025-06-29 12:28:55'),
(37, 'Exptional Global', 'Exptional+Global', 'marvelmysticmayhem@global.netease.com', NULL, '2025-06-29 12:28:55'),
(38, 'Innplay Labs', 'Innplay+Labs', 'support@innplaylabs.com', 'https://www.innplaylabs.com/', '2025-06-29 12:28:56'),
(39, 'Rollic Games', '6018074114375198913', 'developer@gybegames.com', 'https://rollicgames.com/', '2025-06-29 12:28:56'),
(40, 'Scopely', '9028773071151690823', 'support@scopely.com', 'https://monopolygo.helpshift.com', '2025-06-29 12:28:57'),
(41, 'Unicorn Studio Official', '8100784998940834902', 'contact.unicorn.gamestudio@gmail.com', 'https://unicornstudio.online/', '2025-06-29 12:28:57'),
(42, 'Inspired Square FZE', '6041565480154761482', 'support@inspiredsquare.com', 'https://www.inspiredsquare.com', '2025-06-29 12:28:57'),
(43, 'The Pokémon Company', 'The+Pok%C3%A9mon+Company', 'app-auto-reply@pokemon-support.com', NULL, '2025-06-29 12:28:58'),
(44, 'Mobile Gaming Studios Ltd.', '8129104754623123928', 'support@wardrone.zendesk.com', 'https://support.wardrone.miniclip.com/hc/en-gb', '2025-06-29 12:28:58'),
(45, 'SYBO Games', '7363891306616760846', 'help_subwaysurf@sybogames.com', 'https://sybogames.com/', '2025-06-29 12:28:58'),
(46, 'stick hunter', '6963070707592565175', 'asfandtauqer@gmail.com', 'https://stick-hunter.com/', '2025-06-29 12:28:59'),
(47, 'Brave Software', '7093250338202488249', 'support@brave.com', 'https://www.brave.com', '2025-06-29 12:29:10'),
(48, 'Google LLC', '5700313618786177705', 'apps-help@google.com', 'http://www.google.com/voice', '2025-06-29 12:29:10'),
(49, 'Secret Phone, Inc', 'Secret+Phone,+Inc', 'support@zangi.com', 'https://zangi.com', '2025-06-29 12:29:10'),
(50, 'Mozilla', '7083182635971239206', 'firefox-android-feedback@mozilla.com', 'https://www.mozilla.org/firefox/mobile/', '2025-06-29 12:29:11'),
(51, 'Yahoo', '5536369398281991413', 'mail.android.feedback@yahooinc.com', 'https://upgrade.mail.yahoo.com/', '2025-06-29 12:29:11'),
(52, 'AMANOTES PTE. LTD.', '6093352993398167860', 'support@amanotes.com', 'https://amanotes.com/', '2025-06-29 12:30:51'),
(53, 'Estoty', '5912775720545287750', 'media@newfolder.studio', 'https://estoty.com/', '2025-06-29 12:30:51'),
(54, 'Rooftop Game', '7427632452632315969', 'marketing@rooftopgames.com.tr', 'http://rooftopgames.com.tr', '2025-06-29 12:30:51'),
(55, 'IGG.COM', '8895734616362643252', 'help.doomsday.android@igg.com', 'https://www.igg.com', '2025-06-29 12:30:52'),
(56, 'Innersloth LLC', 'Innersloth+LLC', 'support@innersloth.com', 'https://www.innersloth.com', '2025-06-29 12:30:52'),
(57, 'ABI Games Studio', '6949451228358116622', 'hieplm@abigames.com.vn', 'https://abigames.com.vn/', '2025-06-29 12:30:53'),
(58, 'RobTop Games', 'RobTop+Games', 'support@robtopgames.com', 'http://www.robtopgames.com', '2025-06-29 12:30:53'),
(59, 'Big Fish Games', '8355317828905497231', 'info@bigfishgames.com', 'https://www.bigfishgames.com/us/en/company/gummy-drop.html', '2025-06-29 12:30:53'),
(60, 'Moonlight Studio2025', '6882186767752441400', 'contact.moonlightstudio2025@gmail.com', 'https://moonlightstudio.site', '2025-06-29 12:30:53'),
(61, 'JindoBlu', '8369547020914796683', 'jindofrog@gmail.com', 'https://www.jindoblu.com', '2025-06-29 12:30:54'),
(62, 'FALCON GAMES', '5293766053124296887', 'support.fc@falcongames.com', 'https://falcongames.com.vn/', '2025-06-29 12:30:54'),
(63, 'TheSunStudio', 'TheSunStudio', 'cskh.thesunstudio@gmail.com', 'https://thesunstudio.online', '2025-06-29 12:30:54'),
(64, 'SayGames Ltd', '6392896734092635573', 'hotel_master_android@say.games', 'https://say.games/', '2025-06-29 12:30:55'),
(65, 'Think Different FC.', '7594991822386633020', 'thinkdifferent.fcs@gmail.com', 'https://falcongames.com/?lang=en', '2025-06-29 12:30:55'),
(66, 'CASUAL AZUR GAMES', '8232174611457920989', 'info@aigames.ae', 'https://aigames.ae/', '2025-06-29 12:30:55'),
(67, 'Toca Boca', '8567646723268777320', 'tlwsupport@tocaboca.com', 'https://tocaboca.com/help/', '2025-06-29 12:30:56'),
(68, 'Devsisters Corporation', '7767058403001139720', 'support@towerofadventures.zendesk.com', 'https://cs.devsisters.com/cookieruntoa', '2025-06-29 12:30:56'),
(69, 'Yolo Game Studios', '9202376370351337330', 'admin@yologamestudio.com', 'https://www.yologamestudios.com/', '2025-06-29 12:30:56'),
(70, 'FUNFLY PTE. LTD.', 'FUNFLY+PTE.+LTD.', 'support@lastwar.com', 'https://www.lastwar.com/home.html', '2025-06-29 12:30:56'),
(71, 'Big Cake', '7018022841734692714', 'zc@bigcakegame.com', 'http://www.bigcakegame.com/', '2025-06-29 12:30:57'),
(72, 'Playgendary Limited', '4614678246860437532', 'support@newplg.dev', 'https://newplg.dev/', '2025-06-29 12:30:57'),
(73, 'Moruza Games', 'Moruza+Games', 'kuumgotlepumbat@gmail.com', 'https://solvitech.netlify.app/', '2025-06-29 12:30:57'),
(74, 'Mojang', '4772240228547998649', 'help@minecraft.net', 'http://help.mojang.com', '2025-06-29 12:31:03'),
(75, 'Playstack', '6141132371121472740', 'support@balatro.zendesk.com', 'https://www.playbalatro.com/mobile', '2025-06-29 12:31:03'),
(76, 'ninja kiwi', '7266924558817293669', 'support@ninjakiwi.com', 'https://ninjakiwi.com', '2025-06-29 12:31:04'),
(77, 'ConcernedApe', '7304151791356850391', 'contact@stardewvalley.net', 'https://www.stardewvalley.net', '2025-06-29 12:31:04'),
(78, 'Humble Games', '5549044713487227941', 'support@humblebundle.zendesk.com', 'https://www.humblegames.com/games/slay-the-spire/', '2025-06-29 12:31:05'),
(79, 'Clickteam USA LLC', '8278886069431493261', 'ctusallc@gmail.com', 'http://www.clickteam.com', '2025-06-29 12:31:05'),
(80, 'Pixel Respawn LLC', 'Pixel+Respawn+LLC', 'fastemulator@gmail.com', 'http://sites.google.com/site/fastemulator/', '2025-06-29 12:31:05'),
(81, '505 Games Srl', '505+Games+Srl', 'help@505games.com', 'http://www.505games.com', '2025-06-29 12:31:05'),
(82, 'Stray Fawn Studio', 'Stray+Fawn+Studio', 'dungeonclawler@ateo.ch', 'https://dungeonclawler.com/', '2025-06-29 12:31:06'),
(83, '10tons Ltd', '7171874514561735692', 'support@10tons.com', 'https://10tons.com/Support.html', '2025-06-29 12:31:06'),
(84, 'Rockstar Games', '7086639890153802127', 'sanandreasandroidsupport@rockstargames.com', 'http://rockstargames.com', '2025-06-29 12:31:06'),
(85, 'So Far So Good', 'So+Far+So+Good', 'playstore@incredibox.com', 'https://www.incredibox.com/', '2025-06-29 12:31:07'),
(86, 'hasuhasu', '7060285945424257370', 'md_player@hasuhasu.com', 'https://musedash.peropero.net/#/', '2025-06-29 12:31:07'),
(87, 'Playground Productions LLC', 'Playground+Productions+LLC', 'support@playground-productions.com', 'https://backyardsports.com/', '2025-06-29 12:31:08'),
(88, 'Marmalade Game Studio', '8684502731112464883', 'help@marmalademail.com', 'https://marmaladegamestudio.com/', '2025-06-29 12:31:08'),
(89, 'RORTOS', '8013171132272394676', 'rfs@rortos.com', 'http://www.rortos.com', '2025-06-29 12:31:08'),
(90, 'Playdigious', '4837874412965097235', 'support@playdigious.mail.helpshift.com', 'https://playdigious.helpshift.com/hc/en/6-streets-of-rage-4/', '2025-06-29 12:31:09'),
(91, 'Dinosaur Polo Club', 'Dinosaur+Polo+Club', 'support@dinopoloclub.com', 'https://dinopoloclub.com', '2025-06-29 12:31:09'),
(92, 'Doghowl Games Ltd', 'Doghowl+Games+Ltd', 'mobile@doghowlgames.com', 'https://doghowlgames.com', '2025-06-29 12:31:09'),
(93, 'Francisco Zurita', 'Francisco+Zurita', 'fzurita@gmail.com', 'http://www.zurita.me', '2025-06-29 12:31:09'),
(94, '3909', '3909', 'support@papersplea.se', 'https://papersplea.se', '2025-06-29 12:31:10'),
(95, 'Pizza Emulators', '5008101826173560204', 'pizzaemulators@gmail.com', 'https://pizzaemulators.com/', '2025-06-29 12:31:10'),
(96, 'Ironhide Games', '9170275381782328383', 'android@ironhidegames.com', 'http://www.ironhidegames.com', '2025-06-29 12:31:10'),
(97, 'TrampolineTales', '6582513738770964169', 'support@TrampolineTales.com', 'https://TrampolineTales.com/', '2025-06-29 12:31:11'),
(98, 'Robot Circus', 'Robot+Circus', 'info@robot-circus.com', 'http://www.robot-circus.com', '2025-06-29 12:31:11'),
(99, 'Mob Entertainment', 'Mob+Entertainment', 'hello@mobentertainment.com', 'https://www.mobentertainment.com', '2025-06-29 12:31:11'),
(100, 'UserLAnd Technologies', '8617260147938950881', 'support@userland.tech', 'https://userland.tech', '2025-06-29 12:31:11'),
(101, 'Beast Bros. Games', 'Beast+Bros.+Games', 'support+lcb3@montana-games.com', 'https://montana-games.com/faq/', '2025-06-29 12:31:12'),
(102, 'GameFirst', '7151730596087969992', 'feedback@gamefirst.pro', 'https://religion-inc.com/', '2025-06-29 12:31:12'),
(103, 'SQUARE ENIX Co.,Ltd.', '8026010256970589886', 'Android_support@square-enix.com', 'http://www.jp.square-enix.com/', '2025-06-29 12:31:12'),
(104, 'Atari, Inc.', '5233977513008149898', 'support@atari.com', 'http://www.atari.com', '2025-06-29 12:31:13'),
(105, 'Flipline Studios', '5394256898986964167', 'support@flipline.com', 'http://www.flipline.com', '2025-06-29 12:31:14'),
(106, 'Erabit Studios', '6054052760752083656', 'support@erabitstudios.com', 'https://www.erabitstudios.com/', '2025-06-29 12:31:14'),
(107, 'GIANTS Software', '8025483553662244421', 'support@giants-software.com', 'http://www.giants-software.com/', '2025-06-29 12:31:15'),
(108, 'Studio Gridpop Inc', 'Studio+Gridpop+Inc', 'gridpopgames@gmail.com', 'http://gridpop.co/isle/', '2025-06-29 12:31:15'),
(109, 'Nintendo Co., Ltd.', '7277267556905944956', 'ac-pocketcamp-support@nintendo.co.jp', 'https://ac-pocketcamp.com/', '2025-06-29 12:31:15'),
(110, 'ustwo games', '8496315002364483410', 'support@monumentvalleygame.com', 'http://www.monumentvalleygame.com', '2025-06-29 12:31:16'),
(111, 'Fireproof Games', '7811678121966326319', 'info@fireproofgames.com', 'http://www.fireproofgames.com', '2025-06-29 12:31:16'),
(112, 'Henrik Rydgård', 'Henrik+Rydg%C3%A5rd', 'hrydgard+ppssppgold@gmail.com', 'http://www.ppsspp.org/', '2025-06-29 12:31:16'),
(113, 'Sarepta Studio', '6478910658229067749', 'kontakt@sareptastudio.com', 'http://www.mychildlebensborn.com', '2025-06-29 12:31:17'),
(114, 'Aladdin X Inc.', 'Aladdin+X+Inc.', 'SuikaGame_support@aladdinx.jp', 'https://www.aladdinx.jp/pages/suika-game', '2025-06-29 12:31:17'),
(115, 'Niantic, Inc.', 'Niantic,+Inc.', 'pokemon-go-support@nianticlabs.com', 'http://pokemongo.nianticlabs.com/', '2025-06-29 12:31:24'),
(116, 'King', '6577204690045492686', 'candycrush.techhelp@king.com', 'http://candycrushsaga.com', '2025-06-29 12:31:25'),
(117, 'Moon Active', '6898760406631171989', 'support@coinmastergame.com', 'http://moonactive.zendesk.com', '2025-06-29 12:31:25'),
(118, 'Microfun Limited', '8578810333255962286', 'serviceMergemerge@gmail.com', 'https://www.microfun.com/game_cookieEN.html', '2025-06-29 12:31:26'),
(119, 'Playrix', '6598096594674427568', 'support@playrix.com', 'https://www.playrix.com/township/index.html', '2025-06-29 12:31:27'),
(120, 'TG Inc.', '8247472115258417018', 'support@topgamesinc.zendesk.com', 'https://topgamesinc.com', '2025-06-29 12:31:27'),
(121, 'Florere Game', 'Florere+Game', 'support@last-z.com', NULL, '2025-06-29 12:31:28'),
(122, 'Playtika Santa Monica', 'Playtika+Santa+Monica', 'contact-SMO@playtika.com', 'http://www.bingoblitz.com', '2025-06-29 12:31:28'),
(123, 'Peak', '7348725256760208886', 'support@peak.com', 'https://peak.com/support/toonblast', '2025-06-29 12:31:28'),
(124, 'SciPlay', '7621977556026971856', 'android@jackpotpartycasino.zendesk.com', 'https://www.jackpotparty.com', '2025-06-29 12:31:28'),
(125, 'Plarium Global Ltd', '5766366711041032164', 'raid.support@plarium.com', 'http://www.plarium.com', '2025-06-29 12:31:29'),
(126, 'SuperPlay.', '6163102761666559735', 'support@superplay.co', 'http://www.superplay.co/', '2025-06-29 12:31:29'),
(127, 'Scorewarrior', '9087509962033752464', 'support@totalbattle.com', 'http://scorewarrior.com', '2025-06-29 12:31:30'),
(128, 'Product Madness', '5696323743535622294', 'csmandroidsupport@productmadness.com', 'http://www.productmadness.com', '2025-06-29 12:31:31'),
(129, 'Supertreat - A Playtika Studio', '7797209574326486135', 'sgh@supertreat.net', 'http://www.supertreat.net', '2025-06-29 12:31:32'),
(130, 'Activision Publishing, Inc.', 'Activision+Publishing,+Inc.', 'CoDMobile@activision.com', 'http://www.activision.com', '2025-06-29 12:31:32'),
(131, 'Garena International I', 'Garena+International+I', 'freefire@garena.com', NULL, '2025-06-29 12:31:32'),
(132, 'SpinX Games Limited', '5793980904747267349', 'LotsaSlots-cs@spinxgames.com', 'https://spinxgames.com/', '2025-06-29 12:31:33'),
(133, '37GAMES', '6473421354871744170', 'global.support@37games.com', 'https://gsupport.37games.com/home?package=com.global.ztmslg', '2025-06-29 12:31:33'),
(134, 'RiverGame', 'RiverGame', 'support_th@rivergame.net', 'https://www.greenmushrooms.net/', '2025-06-29 12:31:34'),
(135, 'Wooga', '5187629073610793871', 'support@wooga.net', 'https://www.wooga.com', '2025-06-29 12:31:34'),
(136, 'DoubleDown Interactive LLC', '5819088965110992860', 'support@doubledowncasino.com', 'https://www.doubledowninteractive.com', '2025-06-29 12:31:34'),
(137, 'Level Infinite', '8638120915920097780', 'help@nikke-en.com', NULL, '2025-06-29 12:31:35'),
(138, 'Magmatic Games LTD', '4765571944833116862', 'support@traveltowngame.com', 'https://support.traveltowngame.com', '2025-06-29 12:31:35'),
(139, 'Supercell', '6715068722362591614', 'gp-info@supercell.com', 'https://help.supercellsupport.com/clash-of-clans/en/', '2025-06-29 12:31:36'),
(140, 'PLAYSTUDIOS US, LLC', '6266607152549785498', 'community@popslotscasino.com', 'https://www.playstudios.com', '2025-06-29 12:31:36'),
(141, 'Homa', '4656343638685426415', 'allinhole.support@homagames.com', 'https://www.homagames.com/', '2025-06-29 12:31:36'),
(142, 'VIZOR APPS LTD.', '8530020481101400394', 'support@vizor-apps.com', 'https://vizor-games.com/', '2025-06-29 12:31:37'),
(143, 'ELECTRONIC ARTS', '6605125519975771237', 'support@playdemic.mail.helpshift.com', 'http://ea.com', '2025-06-29 12:31:37'),
(144, 'Bandai Namco Entertainment Inc.', 'Bandai+Namco+Entertainment+Inc.', 'ww_gp_dragonball-legends_ad@net.bandai.co.jp', 'https://www.bandainamcoent.co.jp/english/', '2025-06-29 12:31:38'),
(145, 'KAYAC Inc.', '9130285497433890351', 'hyper-info@kayac.com', 'https://kayac.games', '2025-06-29 12:31:55'),
(146, 'Kooapps Games | Fun Arcade and Casual Action Games', '8438468457954317322', 'support@kooapps.com', 'https://kooapps.com', '2025-06-29 12:31:55'),
(147, 'Diced Pixel, LLC', '8338380197239283863', 'support@dicedpixel.com', 'https://dicedpixel.com/', '2025-06-29 12:31:55'),
(148, 'Starplay DMCC', '8390183776728191637', 'support@starplay.games', 'https://starplay.games/', '2025-06-29 12:31:57'),
(149, 'PlayFlix', '6840383751640875392', 'info@theplayflix.com', 'https://theplayflix.com', '2025-06-29 12:31:57'),
(150, 'Wildlife Studios', '8119287488360456150', 'support+sniper3d@fungames-forfree.com', 'https://wildlifestudios.com/', '2025-06-29 12:31:58'),
(151, 'Neron\'s Brother', '4977632237942662751', 'contact@neronsbrother.com', 'https://neronsbrother.com', '2025-06-29 12:31:58'),
(152, 'Freeplay Inc', '4888228308434849941', 'support@freeplay.io', 'https://freeplay.io/', '2025-06-29 12:32:01'),
(153, 'Outfit7 Limited', '5630538819012062144', 'support@outfit7.com', 'https://talkingtomandfriends.com/support/', '2025-06-29 12:32:01'),
(154, 'Lowtech Studios', 'Lowtech+Studios', 'team@slither.io', 'http://slither.io', '2025-06-29 12:32:02'),
(155, 'SkySoft Studio', 'SkySoft+Studio', 'skysoftone2018@gmail.com', 'https://bazooka.vn/', '2025-06-29 12:32:02'),
(156, 'Miniclip.com', '5933611429942957630', 'support@pure-sniper.zendesk.com', 'https://www.miniclip.com/', '2025-06-29 12:32:03'),
(157, 'Imangi Studios', 'Imangi+Studios', 'support-tr2@imangistudios.com', 'http://www.imangistudios.com/contact.html', '2025-06-29 12:32:04'),
(158, '株式会社ドワンゴ', '%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E3%83%89%E3%83%AF%E3%83%B3%E3%82%B4', 'support-en-us@dwango.co.jp', 'https://dwango.co.jp/', '2025-06-29 12:32:04'),
(159, 'M4P Media', 'M4P+Media', 's.danylets@m4pmedia.com', 'https://m4pmedia.com', '2025-06-29 12:32:06'),
(160, 'iStar Technology Investment Co Ltd', 'iStar+Technology+Investment+Co+Ltd', 'daivvstudio@gmail.com', 'https://magicplaystudio.club', '2025-06-29 12:32:07'),
(161, 'Warner Bros. International Enterprises', 'Warner+Bros.+International+Enterprises', 'support@wbgames.com', 'http://support.wbgames.com', '2025-06-29 12:32:16'),
(162, 'Creauctopus', '5100232410553863425', 'ivan@creauctopus.com', 'https://creauctopus.com/', '2025-06-29 12:32:16'),
(163, 'Deca Games', 'Deca+Games', 'support@decagames.com', 'https://decagames.com', '2025-06-29 12:32:17'),
(164, 'KONAMI', 'KONAMI', 'ask-konami@faq.konami.com', 'https://www.konami.com/games/castlevania/jp/ja/', '2025-06-29 12:32:17'),
(165, 'GCenter', '6177492284961668428', 'doanhtu.gcenter@gmail.com', 'https://gcenterstudio.com/', '2025-06-29 12:32:18'),
(166, 'Bethesda Softworks LLC', 'Bethesda+Softworks+LLC', 'help@bethsoft.com', 'http://help.bethesda.net/', '2025-06-29 12:32:18'),
(167, 'CAPCOM CO., LTD.', '5191954708930348962', 'capcom_mc_support@capcom.com', 'https://www.capcom-games.com/megaman/xdive-offline/en-us/', '2025-06-29 12:32:18'),
(168, 'NextEntryCo', '7196217753645279244', 'nextentryco@gmail.com', NULL, '2025-06-29 12:32:18'),
(169, 'FYQD-Studio', '7458356595649941030', 'zengxiancheng@fyqdzg.com', NULL, '2025-06-29 12:32:19'),
(170, 'The Game Kitchen', '5605606517525418384', 'support@thegamekitchen.com', 'https://thegamekitchen.com/blasphemous/', '2025-06-29 12:32:19'),
(171, 'GameCoaster', '6054355236747479153', 'support@gamecoaster.com', 'https://www.facebook.com/GameCoaster/', '2025-06-29 12:32:20'),
(172, 'Frédéric Julian', 'Fr%C3%A9d%C3%A9ric+Julian', 'thelastgame@icloud.com', 'https://frju.itch.io/the-last-game', '2025-06-29 12:32:20'),
(173, 'Giant Global', '7930803962176246587', 'pw.tipsworks@gmail.com', 'https://pw.giant.games', '2025-06-29 12:32:21'),
(174, 'Open Touch Gaming', 'Open+Touch+Gaming', 'support@opentouchgaming.com', NULL, '2025-06-29 12:32:21'),
(175, 'NEKKI', '7514532260246976284', 'support@nekki.mail.helpshift.com', 'https://nekki.helpshift.com/a/shadow-fight-2-special-edition/?p=android', '2025-06-29 12:32:22'),
(176, 'HandyGames', '5551663097723105743', 'support@handy-games.com', 'https://www.handy-games.com/', '2025-06-29 12:32:22'),
(177, 'AGaming+', '6593142508637677912', 'goodmodding.pc@gmail.com', 'http://eagaming.org', '2025-06-29 12:32:22'),
(178, 'DevolverDigital', '6592603558263828430', 'support-downwell@devolverdigital.com', 'http://www.downwellgame.com', '2025-06-29 12:32:23'),
(179, 'KillHouse Games', '7864625291948215189', 'actionsquad_mobile@inthekillhouse.com', 'https://inthekillhouse.com/actionsquad/#trailer', '2025-06-29 12:32:23'),
(180, 'Glowstick Entertainment, Inc.', '6738715645713292301', 'contact@glowstickentertainment.com', 'https://www.glowstickentertainment.com', '2025-06-29 12:32:24'),
(181, 'SNK CORPORATION', '5156685669113307397', 'info@snk-corp.co.jp', 'https://www.snk-corp.co.jp/faq/', '2025-06-29 12:32:24'),
(182, 'Enigma Publishing Limited', 'Enigma+Publishing+Limited', 'avalar.support@enigmapubltd.com', 'https://enigmapubltd.com/index.html', '2025-06-29 12:32:25'),
(183, 'Fayju', '8909292908925902725', 'games@fayju.com', 'http://www.amazingfrog.com', '2025-06-29 12:32:25'),
(184, 'LLC Blini Games', 'LLC+Blini+Games', 'info@blinigames.com', 'https://www.facebook.com/LovecraftUntoldStories', '2025-06-29 12:32:25'),
(185, 'SUCCESS Corporation', '7465381495137076036', 'support@success-corp.net', 'https://heavenseeker.success-corp.co.jp', '2025-06-29 12:32:26'),
(186, 'Flash Game - Flash Game for Mobile', 'Flash+Game+-+Flash+Game+for+Mobile', 'dongvuongxcode@gmail.com', NULL, '2025-06-29 12:32:26'),
(187, 'Feral Interactive', 'Feral+Interactive', 'googleplay@feralinteractive.com', NULL, '2025-06-29 12:32:27'),
(188, 'Fansipan Limited', '7752608683054605616', 'support@fansipan.hk', 'https://fansipan.hk', '2025-06-29 12:32:27'),
(189, 'Kabam Games, Inc.', '5584164941825017957', 'contact@kabam.com', 'https://www.playcontestofchampions.com', '2025-06-29 12:32:34'),
(190, 'Habby', '7972143603605848622', 'archero2@habby.com', 'https://www.habby.fun', '2025-06-29 12:32:35'),
(191, 'MYGAMES MENA FZ LLC', '4752267657972454045', 'wwr_support@pixonic.com', 'http://warrobots.com', '2025-06-29 12:32:35'),
(192, 'HK KURO GAMES LIMITED', '6751239034997003943', 'wutheringwaves_ensupport@kurogames.com', 'https://wutheringwaves.kurogames.com/', '2025-06-29 12:32:36'),
(193, 'Yostar Limited.', '5501543544118454799', 'al.cs@yo-star.com', 'https://azurlane.yo-star.com', '2025-06-29 12:32:36'),
(194, 'ONEMT SGP', '8451548922865108776', 'MGservice@onemt.com', 'https://pte.onemt.com/', '2025-06-29 12:32:37'),
(195, 'KURO TECHNOLOGY (HONG KONG) CO., LIMITED', '8670778571117015724', 'support_english@kurogames.com', 'https://pgr.kurogame.net/', '2025-06-29 12:32:38'),
(196, 'KEFIR', '5888283611010781837', 'support@kefircyprus.com', 'https://www.kefircyprus.com/', '2025-06-29 12:32:38'),
(197, 'Netmarble', '5258410538530331508', 'netmarbles@igsinc.co.kr', 'http://mobile.netmarble.net', '2025-06-29 12:32:38'),
(198, 'Skystone Games Pte. Ltd.', 'Skystone+Games+Pte.+Ltd.', 'mlbb-us@skystone.games', 'https://us.skystone.games', '2025-06-29 12:32:38'),
(199, 'Wargaming Group', '7063148299497943432', 'blitz_android_support@wargaming.net', 'http://wotblitz.com', '2025-06-29 12:32:39'),
(200, 'NetEase Games', 'NetEase+Games', 'bloodstrike@global.netease.com', 'https://www.neteasegames.com/', '2025-06-29 12:32:40'),
(201, 'TinyBytes', '7246933359902698932', 'mwa@tinybytes.com', 'https://massivewarfare.com/', '2025-06-29 12:32:41'),
(202, 'Starform, Inc', 'Starform,+Inc', 'support@starform.co', 'https://playmetalstorm.com/', '2025-06-29 12:32:41'),
(203, 'Artstorm FZE', '4895368388834853061', 'support@artstorm.com', 'https://artstorm.com/', '2025-06-29 12:32:42'),
(204, 'COGNOSPHERE PTE. LTD.', '4759911077617645855', 'honkai3rd_global@hoyoverse.com', 'https://honkaiimpact3.hoyoverse.com/global/', '2025-06-29 12:32:43'),
(205, 'Azur Interactive Games Limited', '5464069849262017456', 'worldwarheroes@azurgames.com', 'https://azurgames.com/', '2025-06-29 12:32:44'),
(206, 'ZeptoLab', '8155782941676464587', 'bulletecho@zeptolab.com', 'https://www.bulletecho.game', '2025-06-29 12:32:44'),
(207, 'GAIJIN NETWORK LTD', '7438469099012683564', 'info@gaijindistribution.com', 'https://wtmobile.com', '2025-06-29 12:32:45'),
(208, 'KLab', 'KLab', 'info-bleach-en@klab.com', 'https://www.bleach-bravesouls.com/en/', '2025-06-29 12:32:46'),
(209, 'Panzerdog', '6498146469952547371', 'support@panzerdog.com', 'https://www.tacticool.game', '2025-06-29 12:32:46'),
(210, 'MOMEND', '5565157081033301617', 'mechwars@momend.com', 'https://momend.com', '2025-06-29 12:32:47'),
(211, 'Sirius Games Yazılım Anonim Şirketi', '7527824279628252317', 'support@siriusgames.co', 'http://www.siriusgames.co', '2025-06-29 12:32:47'),
(212, 'Pandada Games', '6368166854976686904', 'support_global@pandadagames.com', 'https://www.pandadagames.com/app-ads.txt', '2025-06-29 12:32:47');

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int NOT NULL,
  `app_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `developer_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `genre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `summary` text COLLATE utf8mb4_general_ci,
  `description_hash` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `icon_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `header_image_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `video_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `content_rating` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `free` tinyint(1) DEFAULT '1',
  `price` decimal(10,2) DEFAULT '0.00',
  `currency` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price_text` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `score` decimal(3,2) DEFAULT NULL,
  `score_text` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ratings` int DEFAULT '0',
  `reviews` int DEFAULT '0',
  `installs_text` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `min_installs` bigint DEFAULT '0',
  `max_installs` bigint DEFAULT '0',
  `android_version` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `version` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `released_date` date DEFAULT NULL,
  `updated_timestamp` bigint DEFAULT NULL,
  `offers_iap` tinyint(1) DEFAULT '0',
  `iap_range` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ad_supported` tinyint(1) DEFAULT '0',
  `available` tinyint(1) DEFAULT '1',
  `preregister` tinyint(1) DEFAULT '0',
  `early_access` tinyint(1) DEFAULT '0',
  `play_pass` tinyint(1) DEFAULT '0',
  `data_hash` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_changes`
--

CREATE TABLE `game_changes` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `field_name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `old_value` text COLLATE utf8mb4_general_ci,
  `new_value` text COLLATE utf8mb4_general_ci,
  `change_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_descriptions`
--

CREATE TABLE `game_descriptions` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `recent_changes` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `game_screenshots`
--

CREATE TABLE `game_screenshots` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `screenshot_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thumbnail_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `position` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `install_history`
--

CREATE TABLE `install_history` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `min_installs` bigint DEFAULT NULL,
  `max_installs` bigint DEFAULT NULL,
  `installs_text` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `record_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `price_history`
--

CREATE TABLE `price_history` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price_text` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `record_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rating_history`
--

CREATE TABLE `rating_history` (
  `id` int NOT NULL,
  `game_id` int NOT NULL,
  `score` decimal(3,2) DEFAULT NULL,
  `score_text` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ratings` int DEFAULT NULL,
  `reviews` int DEFAULT NULL,
  `record_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scraping_logs`
--

CREATE TABLE `scraping_logs` (
  `id` int NOT NULL,
  `scrape_type` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collection` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `games_scraped` int DEFAULT '0',
  `games_updated` int DEFAULT '0',
  `games_new` int DEFAULT '0',
  `errors` int DEFAULT '0',
  `duration_seconds` int DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` timestamp NULL DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'running',
  `error_message` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scraping_logs`
--

INSERT INTO `scraping_logs` (`id`, `scrape_type`, `category`, `collection`, `games_scraped`, `games_updated`, `games_new`, `errors`, `duration_seconds`, `started_at`, `completed_at`, `status`, `error_message`) VALUES
(1, 'category', 'GAME', 'TOP_FREE', 0, 0, 0, 25, NULL, '2025-06-29 12:28:59', '2025-06-29 12:28:59', 'completed', NULL),
(2, 'category', 'COMMUNICATION', 'TOP_FREE', 0, 0, 0, 15, NULL, '2025-06-29 12:29:11', '2025-06-29 12:29:11', 'completed', NULL),
(3, 'category', 'GAME', 'TOP_FREE', 0, 0, 0, 50, NULL, '2025-06-29 12:30:57', '2025-06-29 12:30:57', 'completed', NULL),
(4, 'category', 'GAME', 'TOP_PAID', 0, 0, 0, 50, NULL, '2025-06-29 12:31:17', '2025-06-29 12:31:17', 'completed', NULL),
(5, 'category', 'GAME', 'GROSSING', 0, 0, 0, 50, NULL, '2025-06-29 12:31:38', '2025-06-29 12:31:38', 'completed', NULL),
(6, 'category', 'GAME_ACTION', 'TOP_FREE', 0, 0, 0, 50, NULL, '2025-06-29 12:32:07', '2025-06-29 12:32:07', 'completed', NULL),
(7, 'category', 'GAME_ACTION', 'TOP_PAID', 0, 0, 0, 50, NULL, '2025-06-29 12:32:27', '2025-06-29 12:32:27', 'completed', NULL),
(8, 'category', 'GAME_ACTION', 'GROSSING', 0, 0, 0, 50, NULL, '2025-06-29 12:32:47', '2025-06-29 12:32:47', 'completed', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_id` (`category_id`);

--
-- Indexes for table `developers`
--
ALTER TABLE `developers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_developer_name` (`name`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `app_id` (`app_id`),
  ADD KEY `idx_app_id` (`app_id`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_developer` (`developer_id`),
  ADD KEY `idx_score` (`score`),
  ADD KEY `idx_ratings` (`ratings`),
  ADD KEY `idx_last_updated` (`last_updated_at`);

--
-- Indexes for table `game_changes`
--
ALTER TABLE `game_changes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_game_changes` (`game_id`,`change_date`);

--
-- Indexes for table `game_descriptions`
--
ALTER TABLE `game_descriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_id` (`game_id`);

--
-- Indexes for table `game_screenshots`
--
ALTER TABLE `game_screenshots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_game_screenshots` (`game_id`);

--
-- Indexes for table `install_history`
--
ALTER TABLE `install_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_install_history` (`game_id`,`record_date`);

--
-- Indexes for table `price_history`
--
ALTER TABLE `price_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_price_history` (`game_id`,`record_date`);

--
-- Indexes for table `rating_history`
--
ALTER TABLE `rating_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_rating_history` (`game_id`,`record_date`);

--
-- Indexes for table `scraping_logs`
--
ALTER TABLE `scraping_logs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=433;

--
-- AUTO_INCREMENT for table `developers`
--
ALTER TABLE `developers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=213;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_changes`
--
ALTER TABLE `game_changes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_descriptions`
--
ALTER TABLE `game_descriptions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_screenshots`
--
ALTER TABLE `game_screenshots`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `install_history`
--
ALTER TABLE `install_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `price_history`
--
ALTER TABLE `price_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rating_history`
--
ALTER TABLE `rating_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scraping_logs`
--
ALTER TABLE `scraping_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `games_ibfk_1` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `games_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `game_changes`
--
ALTER TABLE `game_changes`
  ADD CONSTRAINT `game_changes_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `game_descriptions`
--
ALTER TABLE `game_descriptions`
  ADD CONSTRAINT `game_descriptions_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `game_screenshots`
--
ALTER TABLE `game_screenshots`
  ADD CONSTRAINT `game_screenshots_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `install_history`
--
ALTER TABLE `install_history`
  ADD CONSTRAINT `install_history_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `price_history`
--
ALTER TABLE `price_history`
  ADD CONSTRAINT `price_history_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rating_history`
--
ALTER TABLE `rating_history`
  ADD CONSTRAINT `rating_history_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
