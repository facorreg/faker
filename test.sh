# x=1
# while [ $x -lt 20 ]
# do
#   echo $x
#   # node index.js
#   x=$(( $x + 21 ))
# done

for i in `seq 1 20`;
do
  echo $i
  node index.js

done