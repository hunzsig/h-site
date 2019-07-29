<?php
$myCoins = array(
   'BTC' => array ( 'balance' => 0.0093 ),
   'ETH' => array ( 'balance' => 0.235724420 ),
   'XRB' => array ( 'balance' => 2.524402070 ),
   'MIOTA' => array ('balance' => 33.000000000 ),
   'XRP' => array ( 'balance' => 49.000000000 ),
   'XLM' => array ( 'balance' => 105.894000000 ),
   'TRX' => array ( 'balance' => 599.400000000 )
);
// ok now hit the api...
$coinbasePublicAPI = 'https://api.coinmarketcap.com/v1/ticker/';
$coinData = file_get_contents($coinbasePublicAPI);
$coinData = json_decode($coinData, true);
echo '<table>';
echo '<tr>';
   echo '<td>NAME</td>';
   echo '<td>SYMBOL</td>';
   echo '<td>PRICE</td>';
   echo '<td>HOLDINGS</td>';
   echo '<td>VALUE</td>';
   echo '<td>1hr</td>';
   echo '<td>24hr</td>';
   echo '<td>7day</td>';
echo '</tr>';
$numCoinbaseCoins = sizeof ($coinData);
$portfolioValue = 0;
for ( $xx=0; $xx<$numCoinbaseCoins; $xx++) {
   // this part compares your coins to the data...
   $thisCoinSymbol = $coinData[$xx]['symbol'];
   // if you have it, this var is true...
   $coinHeld = array_key_exists($thisCoinSymbol, $myCoins);
   // comment the next line out & you will see ALL of the coins 
   // returned (not just the ones you own):
   if ( !$coinHeld ) { continue; }
   
   echo '<tr>';
   
      // name:
      echo '<td>' . $coinData[$xx]['name'] .'</td>';
      
      // symbol:
      echo '<td>' . $thisCoinSymbol .'</td>';
      
      // price:
      $thisCoinPrice = $coinData[$xx]['price_usd'];
      echo '<td>&#36;' . number_format($thisCoinPrice,2) .'</td>';
      
      // holdings:
      echo '<td>';
         if ($coinHeld) {
            $myBalance_units = $myCoins[$thisCoinSymbol]['balance'];
            echo number_format($myBalance_units,10);
         }
      echo '</td>';
      
      // track running total value of coins:
      if ($coinHeld) {
         $myBalance_USD = $myBalance_units * $thisCoinPrice;
         $portfolioValue += $myBalance_USD;
      }
      // value:            
      echo '<td>&#36;'. number_format($myBalance_USD,2) .'</td>';
      // 1h market change:
      echo '<td>' . $coinData[$xx]['percent_change_1h'] .'%</td>';
      // 24h market change:
      echo '<td>' . $coinData[$xx]['percent_change_24h'] .'%</td>';
      // 7d market change:
      echo '<td>' . $coinData[$xx]['percent_change_7d'] .'%</td>';
      
   echo '</tr>';
   
}
echo '<tr>';
   echo '<td colspan="4"><strong>TOTAL</strong></td>';
   echo '<td colspan="4"><strong>&#36;' . number_format($portfolioValue,2) . '</strong></td>';
echo '</tr>';
echo '</table>';
?>